import { describe, it, expect } from 'vitest';
import { generateFallbackAnalysis } from '../services/gemini';
import { DecisionInput } from '../types';

describe('Socratic Analysis Engine Logic', () => {
  const sampleInput: DecisionInput = {
    summary: 'Should I take a 6-month internship or accept a full-time offer?',
    context: 'Internship pays $4k/mo in AI startup. Full-time pays $90k in traditional enterprise.',
    reasoning: 'I prefer AI skills but worry about full-time job stability after 6 months.'
  };

  it('generates multi-pass Socratic analysis output with 5 dimensions', () => {
    const result = generateFallbackAnalysis(sampleInput);

    // Verify Pass 1: Stated facts vs unstated assumptions
    expect(result.factsAndAssumptions.statedFacts.length).toBeGreaterThan(0);
    expect(result.factsAndAssumptions.unstatedAssumptions.length).toBeGreaterThan(0);

    // Verify Pass 2: Exactly 5 dimensions
    expect(result.dimensions.length).toBe(5);
    const dimensionsList = result.dimensions.map(d => d.dimension);
    expect(dimensionsList).toContain('second_order_effects');
    expect(dimensionsList).toContain('opportunity_costs');
    expect(dimensionsList).toContain('goal_alignment');
    expect(dimensionsList).toContain('information_asymmetry');
    expect(dimensionsList).toContain('hidden_assumptions');

    // Verify Pass 3: Socratic probing questions & data-gathering actions
    expect(result.socraticQuestions.length).toBeGreaterThanOrEqual(3);
    expect(result.dataSteps.length).toBe(2);

    // Verify non-prescriptive ownership disclaimer
    expect(result.nonPrescriptiveDisclaimer).toContain('Decision Ownership: 100% User');
  });

  it('maintains strictly non-prescriptive language in probing questions', () => {
    const result = generateFallbackAnalysis(sampleInput);

    result.socraticQuestions.forEach(q => {
      expect(q.question).not.toMatch(/\b(You should|I advise|I recommend)\b/i);
    });
  });
});
