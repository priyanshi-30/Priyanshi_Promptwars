import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { subscribeToAuth, loginAnonymously, loginWithGoogle, logoutUser } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((usr) => {
      setUser(usr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnon = async () => {
    setLoading(true);
    try {
      const usr = await loginAnonymously();
      setUser(usr);
    } catch (e) {
      console.error('Anonymous auth error:', e);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const usr = await loginWithGoogle();
      setUser(usr);
    } catch (e) {
      console.error('Google auth error:', e);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signInAnon,
    signInGoogle,
    signOut,
  };
};
