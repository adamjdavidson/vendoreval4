// Report Service: Orchestrates AI-powered report generation
// Feature: 004-analytical-report-format

import { supabase } from '../lib/supabase';
import { reportStorage } from '../utils/reportStorage';
import { researchService } from './researchService';
import type {
  GeneratedReport,
  ReportGenerationRequest,
  CategoryAnalysis,
  StorageStats,
  ResearchFinding,
  CategoryKey,
} from '@shared/types/report';

class ReportService {
  /**
   * Generate a complete AI-powered report from user evaluation
   */
  async generateReport(request: ReportGenerationRequest): Promise<GeneratedReport> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate request
      this.validateRequest(request);

      // Step 1: Calculate grades for all categories
      const categoryGrades = this.calculateAllGrades(request);

      // Check for partial evaluation
      const isPartial = categoryGrades.some(grade => {
        const answeredQuestions = grade.yesCount + grade.limitedCount + grade.noCount + grade.unknownCount;
        return answeredQuestions < grade.totalQuestions;
      });

      if (isPartial) {
        warnings.push(
          'Partial evaluation detected. Report based on incomplete answers may be less accurate.'
        );
      }

      // Calculate completion status
      const totalAnswered = Object.keys(request.answers).length;
      const totalQuestions = request.questions.length;
      const completionPercentage = totalQuestions > 0
        ? Math.round((totalAnswered / totalQuestions) * 100)
        : 0;
      const completionStatus = `${totalAnswered}/${totalQuestions} questions answered (${completionPercentage}%)`;

      // Step 2: Optionally gather external research (Extended Report only)
      let researchFindings: ResearchFinding[] = [];
      let researchQueriesPerformed = 0;
      const researchCacheHits = 0; // TODO: Track cache hits in Phase 4

      if (request.reportMode === 'extended' && request.includeResearch) {
        console.log('[Report Service] Generating Extended Report with research...');
        const categories: CategoryKey[] = ['see', 'change', 'use', 'adapt', 'leave', 'learn'];

        try {
          researchFindings = await researchService.researchVendor(
            request.vendorName,
            categories,
            false // Production mode: use fallback strategy
          );
          researchQueriesPerformed = categories.length * 2; // 6 categories × 2 APIs
          console.log(`[Report Service] Research complete: ${researchFindings.length} findings`);
        } catch (error) {
          console.error('[Report Service] Research failed:', error);
          warnings.push('Some research queries failed. Report based on available information.');
        }
      }

      // Step 3: Call Supabase Edge Function for AI-generated content (synthesis)
      const { data, error } = await supabase.functions.invoke('generate-report-content', {
        body: {
          vendorName: request.vendorName,
          categoryAnalyses: categoryGrades,
          researchFindings,
          voiceMode: request.voiceMode,
          userNotes: request.notes || {},
          evaluationDate: request.evaluationDate || new Date().toISOString().split('T')[0],
          completionStatus,
          requestType: 'synthesis', // Use new analytical format
        },
      });

      if (error) {
        throw new Error(`Report generation failed: ${error.message}`);
      }

      if (!data || !data.headline) {
        throw new Error('Invalid response from report generation service');
      }

      // Step 4: Use AI-generated synthesis sections
      const categoryAnalyses = categoryGrades; // Category analyses remain from grading

      // Step 5: Construct final report
      const report: GeneratedReport = {
        id: crypto.randomUUID(),
        evaluationId: request.evaluationId,
        vendorName: request.vendorName,
        evaluationDate: request.evaluationDate || new Date().toISOString().split('T')[0],
        generatedAt: Date.now(),
        voiceMode: request.voiceMode,
        isPartial,
        reportMode: request.reportMode || 'quick',
        completionStatus,
        headline: data.headline,
        cons: data.cons || '',
        pros: data.pros || '',
        extended: data.extended || '',
        categoryAnalyses,
        researchFindings,
        metadata: {
          generationDurationMs: Date.now() - startTime,
          claudeTokensUsed: data.tokensUsed || 0,
          researchQueriesPerformed,
          researchCacheHits,
          errors,
          warnings,
        },
      };

      // Step 5: Save to LocalStorage
      reportStorage.save(report);

      return report;
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new APITimeoutError('Report generation timed out. Please try again.');
        }
        if (error.message.includes('quota')) {
          throw new StorageQuotaError('Storage full. Please delete old reports.');
        }
        throw error;
      }
      throw new Error('Unknown error during report generation');
    }
  }

  /**
   * Validate report generation request
   */
  private validateRequest(request: ReportGenerationRequest): void {
    if (!request.vendorName || request.vendorName.trim() === '') {
      throw new ValidationError('Vendor name is required');
    }

    if (request.vendorName.length > 200) {
      throw new ValidationError('Vendor name must be less than 200 characters');
    }

    if (!request.answers || Object.keys(request.answers).length === 0) {
      throw new ValidationError('At least one question must be answered');
    }

    if (!request.questions || request.questions.length === 0) {
      throw new ValidationError('Questions are required');
    }

    if (!request.categories || request.categories.length === 0) {
      throw new ValidationError('Categories are required');
    }

    if (!['no-bs', 'corporate'].includes(request.voiceMode)) {
      throw new ValidationError('Invalid voice mode. Must be "no-bs" or "corporate"');
    }
  }

  /**
   * Calculate grades for all categories
   */
  private calculateAllGrades(request: ReportGenerationRequest): CategoryAnalysis[] {
    return request.categories.map(category => {
      // Get questions for this category
      const categoryQuestions = request.questions.filter(
        q => q.categoryKey === category.key
      );

      // Count answers
      let yesCount = 0;
      let limitedCount = 0;
      let noCount = 0;
      let unknownCount = 0;

      categoryQuestions.forEach(question => {
        const answer = request.answers[question.key];
        if (answer === 'yes') yesCount++;
        else if (answer === 'limited') limitedCount++;
        else if (answer === 'no') noCount++;
        else if (answer === 'not-enough-info') unknownCount++;
      });

      const totalQuestions = categoryQuestions.length;

      // Calculate grade based on yes + partial credit for limited (0.5 weight)
      let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
      const weightedScore = yesCount + (limitedCount * 0.5);
      const percentage = totalQuestions > 0 ? (weightedScore / totalQuestions) * 100 : 0;

      if (percentage >= 90) grade = 'A';
      else if (percentage >= 80) grade = 'B';
      else if (percentage >= 70) grade = 'C';
      else if (percentage >= 60) grade = 'D';
      else grade = 'F';

      // Create user answer summary
      const userAnswerSummary = `${yesCount} Yes, ${limitedCount} Limited, ${noCount} No, ${unknownCount} Don't Know`;

      return {
        categoryKey: category.key,
        categoryName: category.name,
        grade,
        yesCount,
        limitedCount,
        noCount,
        unknownCount,
        totalQuestions,
        userAnswerSummary,
        analysisText: '', // Will be filled by AI
        keyInsights: [], // Will be filled by AI
      };
    });
  }

  /**
   * Get a report by ID
   */
  getReportById(id: string): GeneratedReport | null {
    return reportStorage.get(id);
  }

  /**
   * List all reports (most recent first)
   */
  listReports(limit?: number): GeneratedReport[] {
    return reportStorage.list(limit);
  }

  /**
   * Delete a report
   */
  deleteReport(id: string): boolean {
    return reportStorage.delete(id);
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): StorageStats & { percentUsed: number } {
    const stats = reportStorage.getStats();

    // Estimate browser storage limit (Safari: 5MB, others: 10MB+)
    const estimatedLimit = 5 * 1024 * 1024; // Conservative 5MB
    const percentUsed = Math.round((stats.totalSizeBytes / estimatedLimit) * 100);

    return {
      ...stats,
      percentUsed: Math.min(percentUsed, 100), // Cap at 100%
    };
  }

  /**
   * Clean up old reports automatically
   */
  cleanupOldReports(maxAgeDays: number = 90): number {
    return reportStorage.cleanupOldReports(maxAgeDays);
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class APITimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APITimeoutError';
  }
}

export class StorageQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

export const reportService = new ReportService();
