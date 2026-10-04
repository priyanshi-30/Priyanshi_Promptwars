import { DecisionRecord } from '../types';

export const exportToMarkdown = (record: DecisionRecord): string => {
  const { input, analysis, reflectionsHistory } = record;

  let md = `# THE BLIND SPOT - Socratic Decision Analysis\n\n`;
  md += `> **Visual Tag**: Decision Ownership: 100% User\n\n`;
  md += `## 1. Decision Summary\n${input.summary}\n\n`;
  md += `## 2. Context & Constraints\n${input.context}\n\n`;
  md += `## 3. Current Reasoning\n${input.reasoning}\n\n`;

  md += `---\n\n## Stated Facts vs. Unstated Assumptions\n\n`;
  md += `### Stated Facts\n`;
  analysis.factsAndAssumptions.statedFacts.forEach((fact) => {
    md += `- ${fact}\n`;
  });

  md += `\n### Unstated Assumptions Identified\n`;
  analysis.factsAndAssumptions.unstatedAssumptions.forEach((ass) => {
    md += `- [ ] ${ass}\n`;
  });

  md += `\n---\n\n## 5 Dimensions of Overlooked Angles\n\n`;
  analysis.dimensions.forEach((dim) => {
    md += `### [${dim.riskOrImpact.toUpperCase()} RISK] ${dim.title}\n`;
    md += `${dim.description}\n`;
    md += `*Probing Question*: ${dim.keyQuestion}\n\n`;
  });

  md += `---\n\n## Socratic Probing Questions & User Reflections\n\n`;
  analysis.socraticQuestions.forEach((q, index) => {
    const userAns = reflectionsHistory[q.id] || q.userReflection || 'No reflection recorded yet.';
    md += `### Q${index + 1}: ${q.question}\n`;
    md += `*Targeted Blindspot*: ${q.targetBlindspot}\n`;
    md += `*Your Reflection*: ${userAns}\n\n`;
  });

  md += `---\n\n## Concrete Data-Gathering Actions\n\n`;
  analysis.dataSteps.forEach((step, index) => {
    md += `${index + 1}. **${step.action}**\n   - Purpose: ${step.purpose}\n   - Target Output: ${step.metricOrOutput}\n`;
  });

  return md;
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
