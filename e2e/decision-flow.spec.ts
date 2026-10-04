import { test, expect } from '@playwright/test';

test.describe('THE BLIND SPOT - E2E Socratic Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('completes full decision entry, multi-pass analysis, and Socratic reflection', async ({ page }) => {
    // 1. Verify Page Title & Non-Prescriptive Banner
    await expect(page).toHaveTitle(/THE BLIND SPOT/i);
    await expect(page.getByText('Decision Ownership: 100% User')).toBeVisible();

    // 2. Click Preset Scenario
    const samplePreset = page.getByRole('button', { name: /🎓 6-Month Internship vs. Job Offer/i });
    await samplePreset.click();

    // 3. Submit Form for Analysis
    const submitBtn = page.getByRole('button', { name: /Begin Multi-Pass Socratic Analysis/i });
    await submitBtn.click();

    // 4. Verify Multi-Pass Analysis Results Render
    await expect(page.getByText('Pass 1: Stated Facts vs. Assumptions')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Identified Unstated Assumptions')).toBeVisible();

    // 5. Navigate to 5 Overlooked Dimensions Tab
    const dimensionsTab = page.getByRole('button', { name: /Pass 2: 5 Overlooked Dimensions/i });
    await dimensionsTab.click();
    await expect(page.getByText('Cascading Second-Order Effects')).toBeVisible();

    // 6. Navigate to Probing Questions Tab & Answer Reflection
    const questionsTab = page.getByRole('button', { name: /Pass 3: Probing Questions/i });
    await questionsTab.click();

    const firstReflectionBox = page.locator('textarea[id^="reflection-"]').first();
    await firstReflectionBox.fill('If forced to reverse in 90 days, my red flag would be 0 return offer clarity by month 4.');

    const saveReflectionBtn = page.getByRole('button', { name: /Save & Map/i }).first();
    await saveReflectionBtn.click();

    // 7. Verify Visual Decision Tree Map Updates Dynamically
    const mapTab = page.getByRole('button', { name: /Visual Decision Tree Map/i });
    await mapTab.click();
    await expect(page.getByText('Answered Reflections')).toBeVisible();
  });
});
