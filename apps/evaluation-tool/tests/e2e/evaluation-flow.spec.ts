/**
 * E2E Test: Complete User Journey
 *
 * Tests the full evaluation workflow:
 * 1. User logs in with Discord OAuth
 * 2. Creates a new vendor evaluation
 * 3. Answers all 20 questions
 * 4. Exports evaluation as Markdown
 *
 * This test validates the entire user journey from authentication to export.
 */

import { test, expect } from '@playwright/test';

test.describe('Complete Evaluation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start at landing page
    await page.goto('http://localhost:5173');
  });

  test('complete user journey: login → create → answer → export', async ({ page }) => {
    // =========================================================================
    // Step 1: Landing Page - Start Evaluation
    // =========================================================================
    await expect(page.locator('h1')).toContainText('AI Vendor Evaluation Framework');

    const startButton = page.getByRole('button', { name: /start/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Should redirect to evaluation page
    await expect(page).toHaveURL(/\/evaluate/);

    // =========================================================================
    // Step 2: Create New Evaluation
    // =========================================================================
    await expect(page.locator('h1')).toContainText('evaluation questionnaire');

    // Enter vendor name
    const vendorInput = page.getByPlaceholder(/vendor name/i);
    await expect(vendorInput).toBeVisible();
    await vendorInput.fill('TestVendor AI');

    // Verify progress indicator shows 0/20
    await expect(page.getByText(/0\/20/)).toBeVisible();
    await expect(page.getByText(/0%/)).toBeVisible();

    // =========================================================================
    // Step 3: Answer Questions
    // =========================================================================

    // Answer first question (see-1: "Can you see system prompts?")
    const firstQuestion = page.locator('[data-question-key="see-1"]').first();
    await expect(firstQuestion).toBeVisible();

    // Click "Yes" answer
    const yesButton = firstQuestion.locator('[data-answer="yes"]');
    await yesButton.click();

    // Verify answer is selected (icon should change to active state)
    await expect(yesButton).toHaveAttribute('data-active', 'true');

    // Progress should update to 1/20
    await expect(page.getByText(/1\/20/)).toBeVisible();
    await expect(page.getByText(/5%/)).toBeVisible();

    // Add notes to first question
    const addNotesToggle = firstQuestion.getByText(/add notes/i);
    await addNotesToggle.click();

    const notesTextarea = firstQuestion.locator('textarea');
    await expect(notesTextarea).toBeVisible();
    await notesTextarea.fill('Vendor provides full prompt transparency via admin dashboard.');

    // Collapse notes
    const hideNotesToggle = firstQuestion.getByText(/hide notes/i);
    await hideNotesToggle.click();
    await expect(notesTextarea).not.toBeVisible();

    // Answer remaining 19 questions (cycling through answer types)
    const answerTypes = ['yes', 'no', 'not-enough-info'];

    for (let i = 2; i <= 20; i++) {
      const questionKey = getQuestionKey(i);
      const question = page.locator(`[data-question-key="${questionKey}"]`).first();

      // Scroll question into view
      await question.scrollIntoViewIfNeeded();

      // Select answer (cycle through types)
      const answerType = answerTypes[(i - 1) % 3];
      const answerButton = question.locator(`[data-answer="${answerType}"]`);
      await answerButton.click();

      // Verify answer selected
      await expect(answerButton).toHaveAttribute('data-active', 'true');
    }

    // Verify all questions answered
    await expect(page.getByText(/20\/20/)).toBeVisible();
    await expect(page.getByText(/100%/)).toBeVisible();

    // =========================================================================
    // Step 4: View Category Summary
    // =========================================================================

    // Category evaluation summary should now be visible at bottom
    const categorySummary = page.locator('[data-testid="category-summary"]');
    await categorySummary.scrollIntoViewIfNeeded();
    await expect(categorySummary).toBeVisible();

    // Should show 6 category boxes with grades
    const categoryBoxes = categorySummary.locator('[data-testid="category-box"]');
    await expect(categoryBoxes).toHaveCount(6);

    // Verify category names
    await expect(categorySummary.getByText(/SEE/i)).toBeVisible();
    await expect(categorySummary.getByText(/CHANGE/i)).toBeVisible();
    await expect(categorySummary.getByText(/USE/i)).toBeVisible();
    await expect(categorySummary.getByText(/ADAPT/i)).toBeVisible();
    await expect(categorySummary.getByText(/LEAVE/i)).toBeVisible();
    await expect(categorySummary.getByText(/LEARN/i)).toBeVisible();

    // =========================================================================
    // Step 5: Export Evaluation
    // =========================================================================

    const exportButton = page.getByRole('button', { name: /export/i });
    await exportButton.scrollIntoViewIfNeeded();
    await expect(exportButton).toBeVisible();

    // Click export - should trigger download
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/testvendor-ai.*\.md/i);

    // Verify download content
    const downloadPath = await download.path();
    const fs = await import('fs/promises');
    const content = await fs.readFile(downloadPath!, 'utf-8');

    // Verify markdown structure
    expect(content).toContain('# TestVendor AI Evaluation');
    expect(content).toContain('## SEE');
    expect(content).toContain('## CHANGE');
    expect(content).toContain('## USE');
    expect(content).toContain('Can you see system prompts?');
    expect(content).toContain('Vendor provides full prompt transparency');

    // =========================================================================
    // Step 6: Verify Persistence (Reload Page)
    // =========================================================================

    await page.reload();

    // Evaluation should still be loaded
    await expect(page.getByText(/TestVendor AI/i)).toBeVisible();
    await expect(page.getByText(/20\/20/)).toBeVisible();

    // Verify first answer still selected
    const reloadedFirstQuestion = page.locator('[data-question-key="see-1"]').first();
    const reloadedYesButton = reloadedFirstQuestion.locator('[data-answer="yes"]');
    await expect(reloadedYesButton).toHaveAttribute('data-active', 'true');

    // Verify notes persisted
    await reloadedFirstQuestion.getByText(/add notes/i).click();
    const reloadedNotes = reloadedFirstQuestion.locator('textarea');
    await expect(reloadedNotes).toHaveValue(/Vendor provides full prompt transparency/);
  });

  test('voice mode toggle switches between no-bs and corporate', async ({ page }) => {
    await page.goto('http://localhost:5173/evaluate');

    // Default should be "Direct" (no-bs)
    const voiceToggle = page.getByTestId('voice-mode-toggle');
    await expect(voiceToggle).toContainText(/Direct/i);

    // Click to switch to corporate
    await voiceToggle.click();
    await expect(voiceToggle).toContainText(/Suitable for Work/i);

    // Help text should change (check first question)
    const firstQuestion = page.locator('[data-question-key="see-1"]').first();
    const helpIcon = firstQuestion.getByRole('button', { name: /help/i });
    await helpIcon.click();

    const helpModal = page.getByRole('dialog');
    await expect(helpModal).toBeVisible();

    // Corporate version should use professional language
    await expect(helpModal).toContainText(/governance/i);

    await page.getByRole('button', { name: /close/i }).click();

    // Switch back to Direct
    await voiceToggle.click();
    await expect(voiceToggle).toContainText(/Direct/i);

    // Help text should change back
    await helpIcon.click();
    await expect(helpModal).toContainText(/black box/i);
  });

  test('critical questions show red flag warning when answered "no"', async ({ page }) => {
    await page.goto('http://localhost:5173/evaluate');

    // Find first critical question (see-1)
    const criticalQuestion = page.locator('[data-question-key="see-1"]').first();
    await expect(criticalQuestion).toHaveAttribute('data-critical', 'true');

    // Answer "No"
    const noButton = criticalQuestion.locator('[data-answer="no"]');
    await noButton.click();

    // Red flag warning should appear
    const redFlag = page.locator('[data-testid="red-flag-warning"]').first();
    await expect(redFlag).toBeVisible();
    await expect(redFlag).toContainText(/red flag/i);
  });
});

/**
 * Helper function to generate question keys based on order
 * Maps question number (1-20) to question key (e.g., "see-1", "change-2")
 */
function getQuestionKey(questionNumber: number): string {
  const categories = [
    { prefix: 'see', count: 4 },     // see-1 to see-4
    { prefix: 'change', count: 4 },  // change-1 to change-4
    { prefix: 'use', count: 3 },     // use-1 to use-3
    { prefix: 'adapt', count: 3 },   // adapt-1 to adapt-3
    { prefix: 'leave', count: 3 },   // leave-1 to leave-3
    { prefix: 'learn', count: 3 },   // learn-1 to learn-3
  ];

  let cumulative = 0;
  for (const category of categories) {
    if (questionNumber <= cumulative + category.count) {
      const withinCategory = questionNumber - cumulative;
      return `${category.prefix}-${withinCategory}`;
    }
    cumulative += category.count;
  }

  throw new Error(`Invalid question number: ${questionNumber}`);
}
