// Report storage utilities for LocalStorage operations
// Feature: 003-ai-report-generation

import type { GeneratedReport, StorageStats } from '@shared/types/report';

const STORAGE_PREFIX = 'vendoreval:reports:';

export class ReportStorage {
  /**
   * Save a report to LocalStorage
   */
  save(report: GeneratedReport): void {
    const key = `${STORAGE_PREFIX}${report.id}`;
    try {
      localStorage.setItem(key, JSON.stringify(report));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete old reports.');
      }
      throw error;
    }
  }

  /**
   * Get a report by ID with backward compatibility
   */
  get(id: string): GeneratedReport | null {
    const key = `${STORAGE_PREFIX}${id}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const report = JSON.parse(data) as GeneratedReport;
      return this.ensureBackwardCompatibility(report);
    } catch {
      console.error(`Failed to parse report ${id}`);
      return null;
    }
  }

  /**
   * Ensure backward compatibility for reports without analytical format fields
   * Feature: 004-analytical-report-format
   */
  private ensureBackwardCompatibility(report: GeneratedReport): GeneratedReport {
    // If report doesn't have reportMode, it's an old report
    if (!report.reportMode) {
      report.reportMode = 'quick';
    }

    // If report doesn't have cons/pros/extended, add placeholders
    if (!report.cons) {
      report.cons = '(Generated before analytical format)';
    }
    if (!report.pros) {
      report.pros = '(Generated before analytical format)';
    }
    if (!report.extended) {
      report.extended = '(Generated before analytical format)';
    }

    // Ensure headline exists (use first part of first category analysis if missing)
    if (!report.headline && report.categoryAnalyses.length > 0) {
      const firstAnalysis = report.categoryAnalyses[0];
      report.headline = firstAnalysis.analysisText.substring(0, 150) || 'Legacy report';
    }

    return report;
  }

  /**
   * List all reports
   */
  list(limit?: number): GeneratedReport[] {
    const reports: GeneratedReport[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            reports.push(JSON.parse(data) as GeneratedReport);
          } catch {
            console.error(`Failed to parse report from key ${key}`);
          }
        }
      }
    }

    // Sort by generatedAt descending (newest first)
    reports.sort((a, b) => b.generatedAt - a.generatedAt);

    return limit ? reports.slice(0, limit) : reports;
  }

  /**
   * Delete a report
   */
  delete(id: string): boolean {
    const key = `${STORAGE_PREFIX}${id}`;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  /**
   * Delete all reports
   */
  clear(): void {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get storage statistics
   */
  getStats(): StorageStats {
    const reports = this.list();

    if (reports.length === 0) {
      return {
        totalReports: 0,
        totalSizeBytes: 0,
        oldestReportAge: 0,
        averageReportSize: 0,
      };
    }

    const totalSizeBytes = reports.reduce((sum, report) => {
      return sum + new Blob([JSON.stringify(report)]).size;
    }, 0);

    const oldestReport = reports[reports.length - 1];
    const oldestReportAge = Date.now() - oldestReport.generatedAt;

    return {
      totalReports: reports.length,
      totalSizeBytes,
      oldestReportAge,
      averageReportSize: Math.round(totalSizeBytes / reports.length),
    };
  }

  /**
   * Clean up old reports (> 90 days)
   */
  cleanupOldReports(maxAgeDays: number = 90): number {
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - maxAgeMs;
    const reports = this.list();

    let deletedCount = 0;
    reports.forEach(report => {
      if (report.generatedAt < cutoffTime) {
        this.delete(report.id);
        deletedCount++;
      }
    });

    return deletedCount;
  }
}

export const reportStorage = new ReportStorage();
