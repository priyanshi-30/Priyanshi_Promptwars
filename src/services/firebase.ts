import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { DecisionRecord, UserProfile } from '../types';

const getEnvVal = (key: string, metaVal?: string): string => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.[key]) {
    return window.__APP_ENV__[key];
  }
  return metaVal || '';
};

const firebaseConfig = {
  apiKey: getEnvVal('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: getEnvVal('VITE_FIREBASE_AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: getEnvVal('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: getEnvVal('VITE_FIREBASE_STORAGE_BUCKET', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getEnvVal('VITE_FIREBASE_MESSAGING_SENDER_ID', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: getEnvVal('VITE_FIREBASE_APP_ID', import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: getEnvVal('VITE_FIREBASE_MEASUREMENT_ID', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

// Check if valid config exists
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'your_firebase_api_key'
);

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (err) {
    console.warn('Firebase init error, operating in resilient local storage mode:', err);
  }
} else {
  console.info('Firebase keys not configured. Operating in local mode (localStorage persistence).');
}

/**
 * Log engagement events (Firebase Analytics wrapper)
 */
export const trackAnalyticsEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (e) {
      console.warn('Analytics event tracking error:', e);
    }
  }
};

/**
 * Sign in anonymously
 */
export const loginAnonymously = async (): Promise<UserProfile> => {
  if (auth) {
    const cred = await signInAnonymously(auth);
    trackAnalyticsEvent('login_anonymous');
    return {
      uid: cred.user.uid,
      isAnonymous: true,
      displayName: 'Guest Decision Maker',
      email: null,
      photoURL: null
    };
  }

  // Fallback local user
  const localId = localStorage.getItem('blindspot_local_uid') || `guest_${Date.now()}`;
  localStorage.setItem('blindspot_local_uid', localId);
  return {
    uid: localId,
    isAnonymous: true,
    displayName: 'Guest Explorer',
    email: null,
    photoURL: null
  };
};

/**
 * Sign in with Google
 */
export const loginWithGoogle = async (): Promise<UserProfile> => {
  if (auth) {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    trackAnalyticsEvent('login_google');
    return {
      uid: cred.user.uid,
      isAnonymous: false,
      displayName: cred.user.displayName,
      email: cred.user.email,
      photoURL: cred.user.photoURL
    };
  }
  return loginAnonymously();
};

/**
 * Sign Out
 */
export const logoutUser = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

/**
 * Subscribe to Auth State
 */
export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Guest Decision Maker' : 'User'),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
      } else {
        callback(null);
      }
    });
  }

  // Local storage fallback state
  const localUid = localStorage.getItem('blindspot_local_uid');
  if (localUid) {
    callback({
      uid: localUid,
      isAnonymous: true,
      displayName: 'Guest Explorer',
      email: null,
      photoURL: null
    });
  } else {
    callback(null);
  }
  return () => {};
};

/**
 * Save decision record to Firestore / LocalStorage
 */
export const saveDecisionRecord = async (record: DecisionRecord): Promise<void> => {
  trackAnalyticsEvent('save_decision', { decisionId: record.id });
  
  if (db && record.userId) {
    try {
      const docRef = doc(db, 'users', record.userId, 'decisions', record.id);
      await setDoc(docRef, record, { merge: true });
      return;
    } catch (err) {
      console.warn('Firestore save error, saving locally:', err);
    }
  }

  // Local storage fallback
  const existingRecords = getLocalDecisions();
  const index = existingRecords.findIndex(r => r.id === record.id);
  if (index >= 0) {
    existingRecords[index] = record;
  } else {
    existingRecords.unshift(record);
  }
  localStorage.setItem('blindspot_decisions', JSON.stringify(existingRecords));
};

/**
 * Get user decision history
 */
export const getUserDecisions = async (userId: string): Promise<DecisionRecord[]> => {
  if (db && userId) {
    try {
      const colRef = collection(db, 'users', userId, 'decisions');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const docs: DecisionRecord[] = [];
      snapshot.forEach(docSnap => {
        docs.push(docSnap.data() as DecisionRecord);
      });
      return docs;
    } catch (err) {
      console.warn('Firestore read error, reading local records:', err);
    }
  }

  return getLocalDecisions();
};

/**
 * Delete decision record
 */
export const deleteDecisionRecord = async (userId: string, decisionId: string): Promise<void> => {
  if (db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'decisions', decisionId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
  }

  const local = getLocalDecisions().filter(d => d.id !== decisionId);
  localStorage.setItem('blindspot_decisions', JSON.stringify(local));
};

/**
 * Wipe all user data (Data Privacy option)
 */
export const wipeAllUserData = async (userId: string): Promise<void> => {
  if (db && userId) {
    try {
      const records = await getUserDecisions(userId);
      for (const r of records) {
        await deleteDecisionRecord(userId, r.id);
      }
    } catch (e) {
      console.warn('Firestore wipe error:', e);
    }
  }

  localStorage.removeItem('blindspot_decisions');
  localStorage.removeItem('blindspot_local_uid');
  trackAnalyticsEvent('wipe_user_data');
};

// Helper for local storage
const getLocalDecisions = (): DecisionRecord[] => {
  try {
    const raw = localStorage.getItem('blindspot_decisions');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};
