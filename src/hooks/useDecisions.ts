import { useState, useEffect, useCallback } from 'react';
import { DecisionInput, DecisionRecord, SocraticAnalysisResult, SocraticNode } from '../types';
import { analyzeDecisionWithGemini } from '../services/gemini';
import { saveDecisionRecord, getUserDecisions, deleteDecisionRecord, wipeAllUserData } from '../services/firebase';
import { sanitizeInput } from '../utils/sanitize';

export const useDecisions = (userId: string | null) => {
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<DecisionRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to generate node graph structure for visual tree map
  const generateDecisionNodes = (input: DecisionInput, analysis: SocraticAnalysisResult, reflections: Record<string, string>): SocraticNode[] => {
    const nodes: SocraticNode[] = [
      {
        id: 'root',
        label: input.summary || 'Core Decision Summary',
        type: 'root',
        details: input.context
      }
    ];

    // Facts
    analysis.factsAndAssumptions.statedFacts.forEach((fact, idx) => {
      nodes.push({
        id: `fact_${idx}`,
        label: fact,
        type: 'fact',
        parentId: 'root'
      });
    });

    // Unstated Assumptions
    analysis.factsAndAssumptions.unstatedAssumptions.forEach((ass, idx) => {
      nodes.push({
        id: `ass_${idx}`,
        label: ass,
        type: 'assumption',
        parentId: 'root'
      });
    });

    // Dimensions
    analysis.dimensions.forEach((dim, idx) => {
      nodes.push({
        id: `dim_${idx}`,
        label: dim.title,
        type: 'dimension',
        parentId: 'root',
        details: dim.description
      });
    });

    // Socratic Questions & Answers
    analysis.socraticQuestions.forEach((q) => {
      const userAns = reflections[q.id];
      const qNodeId = `q_${q.id}`;
      nodes.push({
        id: qNodeId,
        label: q.question,
        type: 'question',
        parentId: 'root',
        status: userAns ? 'answered' : 'unanswered'
      });

      if (userAns) {
        nodes.push({
          id: `ref_${q.id}`,
          label: userAns,
          type: 'reflection',
          parentId: qNodeId
        });
      }
    });

    return nodes;
  };

  // Load history on mount or when user changes
  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      return;
    }
    try {
      const records = await getUserDecisions(userId);
      setHistory(records);
    } catch (e) {
      console.error('Error fetching decision history:', e);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Run new analysis
  const analyzeDecision = async (rawInput: DecisionInput) => {
    if (!rawInput.summary.trim()) {
      setError('Please provide a decision summary.');
      return;
    }

    const sanitizedInput: DecisionInput = {
      summary: sanitizeInput(rawInput.summary),
      context: sanitizeInput(rawInput.context),
      reasoning: sanitizeInput(rawInput.reasoning)
    };

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeDecisionWithGemini(sanitizedInput);
      const recordId = `dec_${Date.now()}`;
      const now = Date.now();
      const uid = userId || 'anonymous_user';

      const initialReflections: Record<string, string> = {};
      const initialNodes = generateDecisionNodes(sanitizedInput, analysisResult, initialReflections);

      const newRecord: DecisionRecord = {
        id: recordId,
        userId: uid,
        createdAt: now,
        updatedAt: now,
        input: sanitizedInput,
        analysis: analysisResult,
        reflectionsHistory: initialReflections,
        nodes: initialNodes
      };

      setCurrentRecord(newRecord);
      await saveDecisionRecord(newRecord);
      await fetchHistory();
    } catch (err: any) {
      console.error('Decision analysis failure:', err);
      setError(err.message || 'An unexpected error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Answer or update a Socratic probing question
  const updateReflection = async (questionId: string, reflectionText: string) => {
    if (!currentRecord) return;

    const sanitizedText = sanitizeInput(reflectionText);
    const updatedReflections = {
      ...currentRecord.reflectionsHistory,
      [questionId]: sanitizedText
    };

    const updatedQuestions = currentRecord.analysis.socraticQuestions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          userReflection: sanitizedText,
          status: sanitizedText.trim() ? ('answered' as const) : ('unanswered' as const)
        };
      }
      return q;
    });

    const updatedAnalysis: SocraticAnalysisResult = {
      ...currentRecord.analysis,
      socraticQuestions: updatedQuestions
    };

    const updatedNodes = generateDecisionNodes(currentRecord.input, updatedAnalysis, updatedReflections);

    const updatedRecord: DecisionRecord = {
      ...currentRecord,
      updatedAt: Date.now(),
      analysis: updatedAnalysis,
      reflectionsHistory: updatedReflections,
      nodes: updatedNodes
    };

    setCurrentRecord(updatedRecord);
    await saveDecisionRecord(updatedRecord);
    await fetchHistory();
  };

  // Load selected record from history
  const selectRecord = (record: DecisionRecord) => {
    setCurrentRecord(record);
  };

  // Start fresh decision session
  const clearCurrent = () => {
    setCurrentRecord(null);
    setError(null);
  };

  // Delete specific decision
  const removeRecord = async (decisionId: string) => {
    const uid = userId || 'anonymous_user';
    await deleteDecisionRecord(uid, decisionId);
    if (currentRecord?.id === decisionId) {
      setCurrentRecord(null);
    }
    await fetchHistory();
  };

  // Purge all data
  const purgeAllData = async () => {
    const uid = userId || 'anonymous_user';
    await wipeAllUserData(uid);
    setCurrentRecord(null);
    setHistory([]);
  };

  return {
    history,
    currentRecord,
    isAnalyzing,
    error,
    analyzeDecision,
    updateReflection,
    selectRecord,
    clearCurrent,
    removeRecord,
    purgeAllData,
  };
};
