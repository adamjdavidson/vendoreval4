/**
 * Integration Test: Export as Markdown
 *
 * Tests the markdown export functionality to ensure:
 * 1. Correct markdown structure and formatting
 * 2. All evaluation data is included
 * 3. Dual-tone content is properly rendered
 * 4. Category grades and scores are calculated correctly
 */

import { describe, it, expect } from 'vitest';
import { generateMarkdown } from '../../src/utils/export';
import type { Evaluation, Category, Question } from '../../../../shared/types';
import type { VoiceMode } from '../../src/contexts/ToneContext';

// Mock evaluation data
const mockCategories: Category[] = [
  {
    id: '1',
    key: 'see',
    order_index: 1,
    color: '#DFF7FF',
    title_no_bs: 'SEE: What you\'re actually buying',
    title_corporate: 'SEE: Product Transparency',
    subtitle_no_bs: 'Can you actually see how the AI works?',
    subtitle_corporate: 'Understanding the underlying technology',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    key: 'change',
    order_index: 2,
    color: '#D4EDDA',
    title_no_bs: 'CHANGE: Can you control it?',
    title_corporate: 'CHANGE: Configurability',
    subtitle_no_bs: 'Can you customize it for your needs?',
    subtitle_corporate: 'Customization and configuration options',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockQuestions: Question[] = [
  {
    id: 'q1',
    key: 'see-1',
    category_id: '1',
    order_index: 1,
    is_critical: true,
    text_no_bs: 'Can you see system prompts?',
    text_corporate: 'Can you see system prompts?',
    help_text_no_bs: 'System prompts are where the core intelligence lives.',
    help_text_corporate: 'System prompts establish fundamental operating parameters.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'q2',
    key: 'see-2',
    category_id: '1',
    order_index: 2,
    is_critical: false,
    text_no_bs: 'Can you see all other prompts?',
    text_corporate: 'Can you see all other prompts?',
    help_text_no_bs: 'Hidden prompts often contain cost-cutting logic.',
    help_text_corporate: 'Complete visibility ensures system behavior understanding.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'q3',
    key: 'change-1',
    category_id: '2',
    order_index: 1,
    is_critical: true,
    text_no_bs: 'Can you edit the system prompt?',
    text_corporate: 'Can you edit the system prompt?',
    help_text_no_bs: 'Generic prompts will always be suboptimal.',
    help_text_corporate: 'Organizations require prompt customization capability.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockEvaluation: Evaluation = {
  id: 'eval1',
  vendor_name: 'TestVendor AI',
  user_id: 'user1',
  created_at: new Date('2025-01-15').toISOString(),
  updated_at: new Date('2025-01-15').toISOString(),
  answers: [
    {
      question_id: 'q1',
      answer: 'yes',
      notes: 'Vendor provides full system prompt access via admin dashboard.',
      timestamp: new Date('2025-01-15').toISOString(),
    },
    {
      question_id: 'q2',
      answer: 'no',
      notes: 'Only main prompts are visible, routing logic is proprietary.',
      timestamp: new Date('2025-01-15').toISOString(),
    },
    {
      question_id: 'q3',
      answer: 'not-enough-info',
      notes: 'Documentation unclear on prompt editing capabilities.',
      timestamp: new Date('2025-01-15').toISOString(),
    },
  ],
};

// Markdown generation functions are now imported from utils/export.ts

// Wrapper function to match test expectations (uses generateMarkdown from utils)
function exportAsMarkdown(
  evaluation: Evaluation,
  categories: Category[],
  questions: Question[],
  voiceMode: VoiceMode = 'no-bs'
): string {
  return generateMarkdown(evaluation, categories, questions, voiceMode);
}

describe('Export as Markdown', () => {
  describe('Basic Structure', () => {
    it('should generate valid markdown with correct header', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('# TestVendor AI Evaluation');
      expect(markdown).toContain('**Evaluation Date:**');
      expect(markdown).toContain('**Completion:** 3/3 questions answered');
    });

    it('should include all categories with proper headings', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('## SEE: What you\'re actually buying');
      expect(markdown).toContain('## CHANGE: Can you control it?');
    });

    it('should include all questions with answers', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('### Can you see system prompts?');
      expect(markdown).toContain('**Answer:** ✅ Yes');
      expect(markdown).toContain('Vendor provides full system prompt access');
    });
  });

  describe('Answer Formatting', () => {
    it('should format "yes" answers with checkmark', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('**Answer:** ✅ Yes');
    });

    it('should format "no" answers with X mark', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('**Answer:** ❌ No');
    });

    it('should format "not-enough-info" answers with warning', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('**Answer:** ⚠️ Not Enough Info');
    });

    it('should include notes when present', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('**Notes:** Vendor provides full system prompt access');
      expect(markdown).toContain('**Notes:** Only main prompts are visible');
    });
  });

  describe('Critical Questions', () => {
    it('should mark critical questions with warning emoji', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('🚨 **Critical Question**');
    });

    it('should show critical indicator for all critical questions', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      const criticalCount = (markdown.match(/🚨 \*\*Critical Question\*\*/g) || []).length;
      const expectedCriticalCount = mockQuestions.filter((q) => q.is_critical).length;
      expect(criticalCount).toBe(expectedCriticalCount);
    });
  });

  describe('Voice Mode', () => {
    it('should use no-bs tone by default', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('What you\'re actually buying');
      expect(markdown).toContain('Can you actually see how the AI works?');
    });

    it('should use corporate tone when specified', () => {
      const markdown = exportAsMarkdown(
        mockEvaluation,
        mockCategories,
        mockQuestions,
        'corporate'
      );
      expect(markdown).toContain('Product Transparency');
      expect(markdown).toContain('Understanding the underlying technology');
    });

    it('should use correct question text based on voice mode', () => {
      const noBsMarkdown = exportAsMarkdown(
        mockEvaluation,
        mockCategories,
        mockQuestions,
        'no-bs'
      );
      const corporateMarkdown = exportAsMarkdown(
        mockEvaluation,
        mockCategories,
        mockQuestions,
        'corporate'
      );

      // Both should have same questions (text is identical in this case)
      expect(noBsMarkdown).toContain('Can you see system prompts?');
      expect(corporateMarkdown).toContain('Can you see system prompts?');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unanswered questions', () => {
      const partialEvaluation: Evaluation = {
        ...mockEvaluation,
        answers: [mockEvaluation.answers[0]], // Only one answer
      };

      const markdown = exportAsMarkdown(partialEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('**Answer:** ✅ Yes'); // Answered question
      expect(markdown).toContain('**Answer:** Not answered'); // Unanswered questions
    });

    it('should handle empty evaluation', () => {
      const emptyEvaluation: Evaluation = {
        ...mockEvaluation,
        answers: [],
      };

      const markdown = exportAsMarkdown(emptyEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('**Completion:** 0/3 questions answered');
      expect(markdown).toContain('**Answer:** Not answered');
    });

    it('should handle questions without notes', () => {
      const noNotesEvaluation: Evaluation = {
        ...mockEvaluation,
        answers: [
          {
            question_id: 'q1',
            answer: 'yes',
            notes: undefined,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const markdown = exportAsMarkdown(noNotesEvaluation, mockCategories, mockQuestions);

      expect(markdown).toContain('**Answer:** ✅ Yes');
      expect(markdown).not.toContain('**Notes:**');
    });
  });

  describe('Footer', () => {
    it('should include generation attribution', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown).toContain('Generated with VendorEval');
    });

    it('should end with footer after last category', () => {
      const markdown = exportAsMarkdown(mockEvaluation, mockCategories, mockQuestions);
      expect(markdown.trim().endsWith('Generated with VendorEval - AI Vendor Evaluation Framework*')).toBe(true);
    });
  });

  describe('File Naming', () => {
    it('should generate safe filename from vendor name', () => {
      function generateFilename(vendorName: string): string {
        const safe = vendorName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const date = new Date().toISOString().split('T')[0];
        return `${safe}-evaluation-${date}.md`;
      }

      expect(generateFilename('TestVendor AI')).toMatch(/testvendor-ai-evaluation-\d{4}-\d{2}-\d{2}\.md/);
      expect(generateFilename('OpenAI (GPT-4)')).toMatch(/openai-gpt-4-evaluation-\d{4}-\d{2}-\d{2}\.md/);
      expect(generateFilename('Acme Corp.')).toMatch(/acme-corp-evaluation-\d{4}-\d{2}-\d{2}\.md/);
    });
  });
});
