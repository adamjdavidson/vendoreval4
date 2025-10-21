/**
 * Integration Test: Evaluation Management
 *
 * Tests evaluation creation, persistence, and multi-device access:
 * 1. Creating new evaluations saves to database
 * 2. Auto-save functionality persists answers
 * 3. Evaluations accessible from different devices
 * 4. Progress tracking across sessions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/database';

// Mock Supabase for testing
const mockSupabaseUrl = 'http://localhost:54321';
const mockSupabaseKey = 'test-key';

describe('Evaluation Management', () => {
  let supabase: ReturnType<typeof createClient<Database>>;

  beforeEach(() => {
    // Initialize Supabase client for testing
    supabase = createClient<Database>(mockSupabaseUrl, mockSupabaseKey);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Create New Evaluation', () => {
    it('should create evaluation and save to database', async () => {
      const userId = 'test-user-1';
      const vendorName = 'TestVendor AI';

      // Create evaluation
      const { data: evaluation, error } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: vendorName,
          answers: [],
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(evaluation).toBeDefined();
      expect(evaluation?.vendor_name).toBe(vendorName);
      expect(evaluation?.user_id).toBe(userId);
      expect(evaluation?.answers).toEqual([]);
    });

    it('should generate unique evaluation ID', async () => {
      const userId = 'test-user-1';

      // Create two evaluations
      const { data: eval1 } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'Vendor A',
          answers: [],
        })
        .select()
        .single();

      const { data: eval2 } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'Vendor B',
          answers: [],
        })
        .select()
        .single();

      expect(eval1?.id).toBeDefined();
      expect(eval2?.id).toBeDefined();
      expect(eval1?.id).not.toBe(eval2?.id);
    });

    it('should set created_at and updated_at timestamps', async () => {
      const userId = 'test-user-1';

      const { data: evaluation } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [],
        })
        .select()
        .single();

      expect(evaluation?.created_at).toBeDefined();
      expect(evaluation?.updated_at).toBeDefined();
      expect(new Date(evaluation!.created_at)).toBeInstanceOf(Date);
    });
  });

  describe('Answer Auto-Save', () => {
    it('should save answer immediately when user responds', async () => {
      const userId = 'test-user-1';

      // Create evaluation
      const { data: evaluation } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [],
        })
        .select()
        .single();

      // Add first answer
      const updatedAnswers = [
        {
          question_id: 'see-1',
          answer: 'yes' as const,
          notes: 'System prompts are visible in admin panel.',
          timestamp: new Date().toISOString(),
        },
      ];

      const { data: updated, error } = await supabase
        .from('evaluations')
        .update({ answers: updatedAnswers })
        .eq('id', evaluation!.id)
        .select()
        .single();

      expect(error).toBeNull();
      expect(updated?.answers).toHaveLength(1);
      expect(updated?.answers[0].question_id).toBe('see-1');
      expect(updated?.answers[0].answer).toBe('yes');
    });

    it('should update existing answer when changed', async () => {
      const userId = 'test-user-1';

      // Create evaluation with one answer
      const { data: evaluation } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [
            {
              question_id: 'see-1',
              answer: 'yes' as const,
              notes: 'Original answer',
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .select()
        .single();

      // Change answer
      const updatedAnswers = [
        {
          question_id: 'see-1',
          answer: 'no' as const,
          notes: 'Updated: prompts are not visible',
          timestamp: new Date().toISOString(),
        },
      ];

      const { data: updated } = await supabase
        .from('evaluations')
        .update({ answers: updatedAnswers })
        .eq('id', evaluation!.id)
        .select()
        .single();

      expect(updated?.answers[0].answer).toBe('no');
      expect(updated?.answers[0].notes).toContain('Updated');
    });

    it('should preserve other answers when adding new one', async () => {
      const userId = 'test-user-1';

      // Create evaluation with one answer
      const { data: evaluation } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [
            {
              question_id: 'see-1',
              answer: 'yes' as const,
              notes: 'First answer',
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .select()
        .single();

      // Add second answer
      const updatedAnswers = [
        ...evaluation!.answers,
        {
          question_id: 'see-2',
          answer: 'no' as const,
          notes: 'Second answer',
          timestamp: new Date().toISOString(),
        },
      ];

      const { data: updated } = await supabase
        .from('evaluations')
        .update({ answers: updatedAnswers })
        .eq('id', evaluation!.id)
        .select()
        .single();

      expect(updated?.answers).toHaveLength(2);
      expect(updated?.answers[0].question_id).toBe('see-1');
      expect(updated?.answers[1].question_id).toBe('see-2');
    });
  });

  describe('Progress Tracking', () => {
    it('should calculate completion percentage correctly', () => {
      const totalQuestions = 20;

      function calculateCompletion(answeredCount: number): number {
        return Math.round((answeredCount / totalQuestions) * 100);
      }

      expect(calculateCompletion(0)).toBe(0);
      expect(calculateCompletion(1)).toBe(5);
      expect(calculateCompletion(10)).toBe(50);
      expect(calculateCompletion(20)).toBe(100);
    });

    it('should track which questions are answered', () => {
      const answers = [
        { question_id: 'see-1', answer: 'yes' as const },
        { question_id: 'see-2', answer: 'no' as const },
        { question_id: 'change-1', answer: 'not-enough-info' as const },
      ];

      const answeredQuestions = new Set(answers.map((a) => a.question_id));

      expect(answeredQuestions.has('see-1')).toBe(true);
      expect(answeredQuestions.has('see-2')).toBe(true);
      expect(answeredQuestions.has('change-1')).toBe(true);
      expect(answeredQuestions.has('use-1')).toBe(false);
    });

    it('should calculate category completion', () => {
      const categoryQuestions = ['see-1', 'see-2', 'see-3', 'see-4'];
      const answers = [
        { question_id: 'see-1', answer: 'yes' as const },
        { question_id: 'see-2', answer: 'no' as const },
      ];

      const answeredInCategory = answers.filter((a) =>
        categoryQuestions.includes(a.question_id)
      ).length;

      const categoryCompletion = (answeredInCategory / categoryQuestions.length) * 100;

      expect(categoryCompletion).toBe(50);
    });
  });

  describe('Multi-Device Access', () => {
    it('should retrieve evaluation by user ID across devices', async () => {
      const userId = 'test-user-1';

      // Device 1: Create evaluation
      const { data: created } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [
            {
              question_id: 'see-1',
              answer: 'yes' as const,
              notes: 'Created on device 1',
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .select()
        .single();

      // Device 2: Retrieve same evaluation
      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', userId);

      expect(evaluations).toHaveLength(1);
      expect(evaluations?.[0].id).toBe(created?.id);
      expect(evaluations?.[0].answers[0].notes).toContain('device 1');
    });

    it('should sync updates across devices', async () => {
      const userId = 'test-user-1';

      // Device 1: Create evaluation
      const { data: created } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [
            {
              question_id: 'see-1',
              answer: 'yes' as const,
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .select()
        .single();

      // Device 2: Add another answer
      const { data: onDevice1 } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', created!.id)
        .single();

      const updatedAnswers = [
        ...onDevice1!.answers,
        {
          question_id: 'see-2',
          answer: 'no' as const,
          notes: 'Added on device 2',
          timestamp: new Date().toISOString(),
        },
      ];

      await supabase
        .from('evaluations')
        .update({ answers: updatedAnswers })
        .eq('id', created!.id);

      // Device 1: Fetch latest
      const { data: synced } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', created!.id)
        .single();

      expect(synced?.answers).toHaveLength(2);
      expect(synced?.answers[1].notes).toContain('device 2');
    });

    it('should list all user evaluations sorted by date', async () => {
      const userId = 'test-user-1';

      // Create multiple evaluations
      await supabase.from('evaluations').insert([
        {
          user_id: userId,
          vendor_name: 'Vendor A',
          answers: [],
          created_at: new Date('2025-01-10').toISOString(),
        },
        {
          user_id: userId,
          vendor_name: 'Vendor B',
          answers: [],
          created_at: new Date('2025-01-15').toISOString(),
        },
        {
          user_id: userId,
          vendor_name: 'Vendor C',
          answers: [],
          created_at: new Date('2025-01-05').toISOString(),
        },
      ]);

      // Retrieve sorted by most recent first
      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      expect(evaluations).toHaveLength(3);
      expect(evaluations?.[0].vendor_name).toBe('Vendor B');
      expect(evaluations?.[1].vendor_name).toBe('Vendor A');
      expect(evaluations?.[2].vendor_name).toBe('Vendor C');
    });
  });

  describe('Persistence Across Sessions', () => {
    it('should load evaluation state on page reload', async () => {
      const userId = 'test-user-1';

      // Session 1: Create and answer
      const { data: created } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [
            {
              question_id: 'see-1',
              answer: 'yes' as const,
              notes: 'Session 1 answer',
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .select()
        .single();

      // Simulate page reload - fetch evaluation
      const { data: reloaded } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', created!.id)
        .single();

      expect(reloaded?.answers).toHaveLength(1);
      expect(reloaded?.answers[0].question_id).toBe('see-1');
      expect(reloaded?.answers[0].notes).toBe('Session 1 answer');
    });

    it('should resume from last answered question', () => {
      const answers = [
        { question_id: 'see-1', answer: 'yes' as const },
        { question_id: 'see-2', answer: 'no' as const },
        { question_id: 'see-3', answer: 'yes' as const },
      ];

      // Last answered is see-3 (question #3)
      // Next question to answer is see-4 (question #4)
      const lastAnswered = answers[answers.length - 1].question_id;

      expect(lastAnswered).toBe('see-3');

      // Logic to determine next question
      const questionOrder = ['see-1', 'see-2', 'see-3', 'see-4', 'change-1'];
      const lastIndex = questionOrder.indexOf(lastAnswered);
      const nextQuestion = questionOrder[lastIndex + 1];

      expect(nextQuestion).toBe('see-4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty vendor name', async () => {
      const userId = 'test-user-1';

      const { error } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: '',
          answers: [],
        })
        .select()
        .single();

      // Empty vendor name should be allowed (user might fill it later)
      expect(error).toBeNull();
    });

    it('should handle rapid successive updates', async () => {
      const userId = 'test-user-1';

      const { data: evaluation } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: 'TestVendor',
          answers: [],
        })
        .select()
        .single();

      // Simulate rapid updates (user quickly answering questions)
      const updates = [
        [{ question_id: 'see-1', answer: 'yes' as const, timestamp: new Date().toISOString() }],
        [
          { question_id: 'see-1', answer: 'yes' as const, timestamp: new Date().toISOString() },
          { question_id: 'see-2', answer: 'no' as const, timestamp: new Date().toISOString() },
        ],
        [
          { question_id: 'see-1', answer: 'yes' as const, timestamp: new Date().toISOString() },
          { question_id: 'see-2', answer: 'no' as const, timestamp: new Date().toISOString() },
          {
            question_id: 'see-3',
            answer: 'not-enough-info' as const,
            timestamp: new Date().toISOString(),
          },
        ],
      ];

      for (const answers of updates) {
        await supabase
          .from('evaluations')
          .update({ answers })
          .eq('id', evaluation!.id);
      }

      // Verify final state
      const { data: final } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluation!.id)
        .single();

      expect(final?.answers).toHaveLength(3);
    });

    it('should handle special characters in vendor name', async () => {
      const userId = 'test-user-1';
      const vendorName = 'Acme Corp. (AI Division) - "Enterprise" Edition';

      const { data: evaluation, error } = await supabase
        .from('evaluations')
        .insert({
          user_id: userId,
          vendor_name: vendorName,
          answers: [],
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(evaluation?.vendor_name).toBe(vendorName);
    });
  });
});
