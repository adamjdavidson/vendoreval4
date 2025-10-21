import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { Answer } from '@shared/types';

type Tables = Database['public']['Tables'];
type Category = Tables['categories']['Row'];
type Question = Tables['questions']['Row'];
type Vendor = Tables['vendors']['Row'];
type VendorEvaluation = Tables['vendor_evaluations']['Row'];
type Evaluation = Tables['evaluations']['Row'];

export const databaseService = {
  /**
   * Fetch all categories (ordered by order_index)
   */
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all questions (ordered by category, then order_index)
   */
  async getQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch questions by category
   */
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category_id', categoryId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all vendors
   */
  async getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch vendor by slug
   */
  async getVendorBySlug(slug: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch vendor evaluations (official pre-analyzed answers)
   */
  async getVendorEvaluations(vendorId: string): Promise<VendorEvaluation[]> {
    const { data, error } = await supabase
      .from('vendor_evaluations')
      .select('*')
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch user's evaluations
   */
  async getUserEvaluations(userId: string): Promise<Evaluation[]> {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create new evaluation
   */
  async createEvaluation(
    userId: string,
    vendorName: string
  ): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        user_id: userId,
        vendor_name: vendorName,
        answers: [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update evaluation answers
   */
  async updateEvaluation(
    evaluationId: string,
    answers: Answer[]
  ): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .update({ answers: answers as unknown as Database['public']['Tables']['evaluations']['Update']['answers'] })
      .eq('id', evaluationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete evaluation
   */
  async deleteEvaluation(evaluationId: string): Promise<void> {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', evaluationId);

    if (error) throw error;
  },
};
