// Report Generator Component
// Feature: 003-ai-report-generation
// Updated: 005-ai-research-pipeline (Phase 3 - Added filtering progress indicators)

import { useState } from 'react';
import { reportService, ValidationError, APITimeoutError, StorageQuotaError } from '../../services/reportService';
import type { GeneratedReport, VoiceMode, ReportMode } from '@shared/types/report';

interface ReportGeneratorProps {
  evaluationId: string;
  vendorName: string;
  answers: Record<string, 'yes' | 'limited' | 'no' | 'not-enough-info'>;
  notes: Record<string, string>;
  questions: any[];
  categories: any[];
  onReportGenerated: (report: GeneratedReport) => void;
}

export function ReportGenerator({
  evaluationId,
  vendorName,
  answers,
  notes,
  questions,
  categories,
  onReportGenerated,
}: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('no-bs');
  const [reportMode, setReportMode] = useState<ReportMode>('quick');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setProgress('');

    try {
      // Show progress for extended reports with research
      if (reportMode === 'extended') {
        setProgress('Gathering research from multiple sources...');
        setTimeout(() => setProgress('Filtering results for relevance with AI...'), 2000);
        setTimeout(() => setProgress('Synthesizing findings into report...'), 8000);
      }

      const report = await reportService.generateReport({
        evaluationId,
        vendorName,
        answers,
        notes,
        questions,
        categories,
        voiceMode,
        evaluationDate: new Date().toISOString().split('T')[0],
        reportMode,
        includeResearch: reportMode === 'extended',
      });

      onReportGenerated(report);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError('Please complete more questions before generating a report.');
      } else if (err instanceof APITimeoutError) {
        setError('Report generation timed out. Please try again.');
      } else if (err instanceof StorageQuotaError) {
        setError('Storage full. Please delete old reports and try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to generate report. Please try again.');
      }
      console.error('Report generation error:', err);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  // Check if enough questions are answered
  const answeredCount = Object.values(answers).filter(a => a !== 'not-enough-info').length;
  const isDisabled = generating || answeredCount < 10;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate AI Report</h2>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Generate an AI-powered evaluation report based on your answers. The report will include:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Executive headline summarizing your assessment</li>
          <li>Detailed analysis for each category</li>
          <li>Key insights and recommendations</li>
          <li>Letter grades based on your answers</li>
        </ul>
        {answeredCount < 10 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Answer at least 10 questions to generate a report. Currently answered: {answeredCount}/20
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="report-mode" className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <select
          id="report-mode"
          value={reportMode}
          onChange={(e) => setReportMode(e.target.value as ReportMode)}
          disabled={generating}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="quick">Quick Report (~60 seconds) - Analysis only</option>
          <option value="extended">Extended Report (~3-5 minutes) - With external research</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">
          {reportMode === 'quick'
            ? '⚡ Fast synthesis based on your answers only'
            : '🔍 In-depth analysis with research from Brave Search and Exa (requires API keys)'}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="voice-mode" className="block text-sm font-medium text-gray-700 mb-2">
          Voice Mode
        </label>
        <select
          id="voice-mode"
          value={voiceMode}
          onChange={(e) => setVoiceMode(e.target.value as VoiceMode)}
          disabled={generating}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="no-bs">No BS - Direct, candid analysis</option>
          <option value="corporate">Corporate - Professional, formal tone</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">
          {voiceMode === 'no-bs'
            ? 'Direct language that cuts through marketing speak'
            : 'Professional language suitable for formal business contexts'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isDisabled}
        className={`
          w-full px-6 py-3 text-white font-medium rounded-md
          transition-colors duration-200
          ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        {generating ? 'Generating Report...' : 'Generate Report'}
      </button>

      {generating && (
        <div className="mt-4 space-y-2">
          <p className="text-center text-sm text-gray-500">
            {reportMode === 'quick'
              ? 'This may take 30-60 seconds. Please don\'t close this page.'
              : 'Extended report generation takes 3-5 minutes. Please don\'t close this page.'}
          </p>
          {progress && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-800 text-sm text-center">
                🔄 {progress}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
