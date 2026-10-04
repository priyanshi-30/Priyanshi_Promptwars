import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DecisionForm } from '../components/DecisionForm';

describe('DecisionForm Component', () => {
  it('renders input fields and preset scenarios', () => {
    const handleSubmit = vi.fn();
    render(<DecisionForm onSubmit={handleSubmit} isAnalyzing={false} />);

    expect(screen.getByLabelText(/1. Primary Decision Summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/2. Context & Constraints/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/3. Your Current Reasoning/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Begin Multi-Pass Socratic Analysis/i })).toBeInTheDocument();
  });

  it('populates fields when a preset scenario is clicked', () => {
    const handleSubmit = vi.fn();
    render(<DecisionForm onSubmit={handleSubmit} isAnalyzing={false} />);

    const presetBtn = screen.getByRole('button', { name: /🎓 6-Month Internship vs. Job Offer/i });
    fireEvent.click(presetBtn);

    const summaryInput = screen.getByLabelText(/1. Primary Decision Summary/i) as HTMLInputElement;
    expect(summaryInput.value).toContain('Should I take a 6-month specialized AI internship');
  });

  it('triggers onSubmit with input data when submitted', () => {
    const handleSubmit = vi.fn();
    render(<DecisionForm onSubmit={handleSubmit} isAnalyzing={false} />);

    const summaryInput = screen.getByLabelText(/1. Primary Decision Summary/i);
    fireEvent.change(summaryInput, { target: { value: 'Should I move to SF?' } });

    const submitBtn = screen.getByRole('button', { name: /Begin Multi-Pass Socratic Analysis/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      summary: 'Should I move to SF?',
      context: '',
      reasoning: ''
    });
  });
});
