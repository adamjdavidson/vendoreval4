// Report Preview Component - Display generated report
// Feature: 004-analytical-report-format

import type { GeneratedReport } from '@shared/types/report';

interface ReportPreviewProps {
  report: GeneratedReport;
  onExportPDF?: () => void;
  onClose?: () => void;
}

export function ReportPreview({ report, onExportPDF, onClose }: ReportPreviewProps) {
  const gradeColor = (grade: string): string => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'F':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format markdown-style text to preserve line breaks
  const formatText = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim() !== '');
  };

  // Determine if we have the new analytical format
  const hasAnalyticalFormat = report.cons || report.pros || report.extended;

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Evaluation Report</h2>
            <p className="text-lg text-gray-600">{report.vendorName}</p>
            <p className="text-sm text-gray-500 mt-1">
              {report.evaluationDate && `Evaluation Date: ${report.evaluationDate} • `}
              {report.completionStatus && `${report.completionStatus} • `}
              Generated: {new Date(report.generatedAt).toLocaleString()} •{' '}
              {report.voiceMode === 'no-bs' ? 'No BS' : 'Corporate'} Voice
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close report"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Partial evaluation warning */}
        {report.isPartial && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-bold text-yellow-800">⚠️ WARNING: Partial Evaluation</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This report is based on incomplete answers. {report.completionStatus || 'Not all questions were answered'}. Results may be less accurate or miss critical issues.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Headline */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">Headline</h3>
        <p className="text-xl font-semibold text-gray-900 leading-relaxed">{report.headline}</p>
      </div>

      {/* Analytical Format Sections (Cons/Pros/Extended) */}
      {hasAnalyticalFormat && (
        <>
          {/* Cons Section */}
          {report.cons && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-red-900 mb-3 uppercase tracking-wide">
                {report.voiceMode === 'corporate' ? 'Considerations' : 'Cons'} (Why {report.voiceMode === 'corporate' ? 'Requiring Attention' : 'Concerning'})
              </h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                <div className="space-y-3">
                  {formatText(report.cons).map((paragraph, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pros Section */}
          {report.pros && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-green-900 mb-3 uppercase tracking-wide">
                {report.voiceMode === 'corporate' ? 'Strengths' : 'Pros'} (Why They Matter)
              </h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                <div className="space-y-3">
                  {formatText(report.pros).map((paragraph, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Extended Section */}
          {report.extended && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3 uppercase tracking-wide">
                {report.voiceMode === 'corporate' ? 'Strategic Analysis' : 'Extended Analysis'}
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                <div className="space-y-3">
                  {formatText(report.extended).map((paragraph, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Analyses (Supporting Detail) */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {hasAnalyticalFormat ? 'Supporting Detail: Category Analyses' : 'Category Analyses'}
        </h3>
        {hasAnalyticalFormat && (
          <p className="text-sm text-gray-600 mb-6">
            Detailed breakdown of findings by evaluation category for reference.
          </p>
        )}

        <div className="space-y-8">
          {report.categoryAnalyses.map((analysis, index) => (
            <div key={analysis.categoryKey} className="border-b border-gray-300 last:border-0 pb-8 last:pb-0">
              {/* Category header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{analysis.categoryName}</h4>
                  <p className="text-sm text-gray-500 mt-1">{analysis.userAnswerSummary}</p>
                </div>
                <div
                  className={`
                    px-4 py-2 rounded-md border-2 font-bold text-2xl
                    ${gradeColor(analysis.grade)}
                  `}
                >
                  {analysis.grade}
                </div>
              </div>

              {/* Analysis text */}
              <p className="text-gray-700 leading-relaxed mb-4">{analysis.analysisText}</p>

              {/* Key insights */}
              {analysis.keyInsights.length > 0 && (
                <div className="bg-white rounded-md p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Key Insights:</p>
                  <ul className="space-y-2">
                    {analysis.keyInsights.map((insight, insightIndex) => (
                      <li key={insightIndex} className="flex items-start text-sm text-gray-800">
                        <span className="mr-2 mt-1 flex-shrink-0">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>Generation Time: {(report.metadata.generationDurationMs / 1000).toFixed(2)}s</p>
            <p className="mt-1">Report Mode: {report.reportMode === 'quick' ? 'Quick (no research)' : 'Extended (with research)'}</p>
            {report.metadata.warnings.length > 0 && (
              <p className="text-yellow-600 mt-1">⚠️ {report.metadata.warnings.length} warning(s)</p>
            )}
          </div>

          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
            >
              Export to PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
