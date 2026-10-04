import { GoogleGenAI, Type } from '@google/genai';
import { DecisionInput, SocraticAnalysisResult, SocraticQuestion } from '../types';

const getApiKey = (): string => {
  const runtimeKey = typeof window !== 'undefined' ? window.__APP_ENV__?.VITE_GEMINI_API_KEY : '';
  return runtimeKey || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const generateFallbackAnalysis = (input: DecisionInput): SocraticAnalysisResult => {
  return {
    factsAndAssumptions: {
      statedFacts: [
        `Target Decision: "${input.summary}"`,
        `Stated Context: ${input.context || 'General decision environment'}`,
        `Stated Rationale: ${input.reasoning || 'Personal decision criteria'}`
      ],
      unstatedAssumptions: [
        "Assumes current market and economic conditions will remain stable over the decision horizon.",
        "Assumes long-term personal goals will stay fixed without changing priorities.",
        "Assumes available alternative paths offer strictly lower utility without complete evaluation.",
        "Assumes short-term trade-offs will not compound into significant invisible burnout."
      ]
    },
    dimensions: [
      {
        dimension: 'second_order_effects',
        title: 'Cascading Second-Order Effects',
        description: 'Primary choices create unintended downstream commitments that constrain future flexibility.',
        riskOrImpact: 'high',
        keyQuestion: 'What unexpected obligations might arise 6 to 18 months after committing to this path?'
      },
      {
        dimension: 'opportunity_costs',
        title: 'Hidden Opportunity Costs',
        description: 'Committing resources here precludes pursuing parallel unexamined high-value endeavors.',
        riskOrImpact: 'high',
        keyQuestion: 'What strategic opportunities or skill-building paths are implicitly forfeited during this timeframe?'
      },
      {
        dimension: 'goal_alignment',
        title: '3-Year Goal Coherence',
        description: 'Short-term tactical advantages may diverge subtly from core 3-year strategic identity.',
        riskOrImpact: 'medium',
        keyQuestion: 'How directly does this daily allocation of energy construct your desired trajectory 3 years from today?'
      },
      {
        dimension: 'information_asymmetry',
        title: 'Information Asymmetry & Unknowns',
        description: 'Unverified assumptions about external parties, implicit promises, or missing baseline data.',
        riskOrImpact: 'high',
        keyQuestion: 'What crucial information is currently missing that could alter your evaluation if uncovered?'
      },
      {
        dimension: 'hidden_assumptions',
        title: 'Unexamined Psychological Premise',
        description: 'Decisions framed around avoiding downside vs. expanding upside potential.',
        riskOrImpact: 'medium',
        keyQuestion: 'To what degree is this decision driven by risk aversion or social expectation rather than conviction?'
      }
    ],
    socraticQuestions: [
      {
        id: 'q1',
        question: `If you were forced to reverse this decision in 90 days, what early indicators would signal that necessity?`,
        targetBlindspot: 'Failure modes and reversal criteria',
        reflectionPrompt: 'Detail specific red flags or metrics that would prompt a pivot.',
        status: 'unanswered'
      },
      {
        id: 'q2',
        question: `What is the most critical assumption in your reasoning that, if proven false by 20%, makes this choice unviable?`,
        targetBlindspot: 'Single point of failure assumption',
        reflectionPrompt: 'Identify your central premise and test its fragility.',
        status: 'unanswered'
      },
      {
        id: 'q3',
        question: `How would a neutral third-party expert with zero emotional stake critique your context and reasoning?`,
        targetBlindspot: 'Confirmation bias and emotional framing',
        reflectionPrompt: 'Write down the objective skeptic counter-argument.',
        status: 'unanswered'
      },
      {
        id: 'q4',
        question: `What alternative path have you discounted earliest, and what specific evidence led you to reject it?`,
        targetBlindspot: 'Premature option elimination',
        reflectionPrompt: 'Revisit discarded alternatives with fresh scrutiny.',
        status: 'unanswered'
      }
    ],
    dataSteps: [
      {
        id: 'd1',
        action: 'Conduct 2 informational interviews with individuals 2 years ahead on this path.',
        purpose: 'Uncover hidden friction points and realistic day-to-day realities.',
        metricOrOutput: 'List of 3 concrete unadvertised challenges reported by peers.'
      },
      {
        id: 'd2',
        action: 'Perform a 48-hour pre-mortem exercise documenting worst-case operational outcomes.',
        purpose: 'Identify preventive mitigations and stress-test assumptions.',
        metricOrOutput: 'Pre-mortem risk register with 3 clear preventive steps.'
      }
    ],
    nonPrescriptiveDisclaimer: 'Decision Ownership: 100% User. This Socratic breakdown does NOT offer advice or tell you what to choose. It illuminates unexamined angles to empower your independent judgment.',
    analyzedAt: new Date().toISOString()
  };
};

/**
 * Executes 3-pass Socratic analysis using Gemini API via @google/genai SDK
 */
export const analyzeDecisionWithGemini = async (input: DecisionInput): Promise<SocraticAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn('Gemini API key missing (VITE_GEMINI_API_KEY). Using Socratic fallback engine.');
    // Simulate brief network latency for realistic UX demo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateFallbackAnalysis(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an elite Socratic Reasoning Engine designed for "THE BLIND SPOT" application.
Your core mission is to help users identify blind spots, unstated assumptions, second-order effects, missing information, and hidden risks in their decisions.

STRICT RULE: YOU MUST NEVER MAKE DECISIONS FOR THE USER. 
NEVER use prescriptive language such as "You should", "I recommend", "I advise", "You ought to", or "The best choice is".
Always maintain a purely inquisitive, analytical, Socratic, and non-prescriptive tone.

Perform a multi-pass Socratic analysis:
1. Pass 1: Differentiate stated facts vs unstated assumptions.
2. Pass 2: Analyze across 5 specific dimensions:
   - Second-Order Effects (Downstream ripple consequences)
   - Opportunity Costs (Forgone alternatives and time trade-offs)
   - Goal Alignment (Coherence with long-term strategic vision)
   - Information Asymmetry (Missing information, unverified claims, or blind spots)
   - Hidden Assumptions (Unexamined premises or emotional bias)
3. Pass 3: Formulate 3 to 5 targeted Socratic questions for reflection and 2 concrete data-gathering actions.

Provide response in structured JSON schema matching the specification.`;

    const prompt = `Decision Summary: ${input.summary}
Context & Constraints: ${input.context}
Current Reasoning & Rationale: ${input.reasoning}

Analyze this decision strictly following Socratic principles.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            factsAndAssumptions: {
              type: Type.OBJECT,
              properties: {
                statedFacts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Explicit facts stated in the input'
                },
                unstatedAssumptions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Implicit or unstated assumptions embedded in the reasoning'
                }
              },
              required: ['statedFacts', 'unstatedAssumptions']
            },
            dimensions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dimension: {
                    type: Type.STRING,
                    enum: [
                      'second_order_effects',
                      'opportunity_costs',
                      'goal_alignment',
                      'information_asymmetry',
                      'hidden_assumptions'
                    ]
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  riskOrImpact: {
                    type: Type.STRING,
                    enum: ['high', 'medium', 'low']
                  },
                  keyQuestion: { type: Type.STRING }
                },
                required: ['dimension', 'title', 'description', 'riskOrImpact', 'keyQuestion']
              }
            },
            socraticQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  targetBlindspot: { type: Type.STRING },
                  reflectionPrompt: { type: Type.STRING }
                },
                required: ['id', 'question', 'targetBlindspot', 'reflectionPrompt']
              }
            },
            dataSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  action: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  metricOrOutput: { type: Type.STRING }
                },
                required: ['id', 'action', 'purpose', 'metricOrOutput']
              }
            },
            nonPrescriptiveDisclaimer: {
              type: Type.STRING
            }
          },
          required: ['factsAndAssumptions', 'dimensions', 'socraticQuestions', 'dataSteps', 'nonPrescriptiveDisclaimer']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Received empty response from Gemini API');
    }

    const rawData = JSON.parse(responseText);

    // Format Socratic questions with status
    const formattedQuestions: SocraticQuestion[] = (rawData.socraticQuestions || []).map((q: any, idx: number) => ({
      id: q.id || `q_${idx + 1}`,
      question: q.question,
      targetBlindspot: q.targetBlindspot,
      reflectionPrompt: q.reflectionPrompt,
      status: 'unanswered'
    }));

    return {
      factsAndAssumptions: rawData.factsAndAssumptions,
      dimensions: rawData.dimensions,
      socraticQuestions: formattedQuestions,
      dataSteps: rawData.dataSteps,
      nonPrescriptiveDisclaimer: 'Decision Ownership: 100% User. Non-prescriptive Socratic analysis.',
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini API Error, falling back to local analysis engine:', error);
    return generateFallbackAnalysis(input);
  }
};
