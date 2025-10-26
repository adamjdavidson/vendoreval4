// Report Progress Component - Loading indicator for report generation
// Feature: 003-ai-report-generation

interface ReportProgressProps {
  stage: 'calculating' | 'generating' | 'finalizing';
  message?: string;
}

export function ReportProgress({ stage, message }: ReportProgressProps) {
  const stageMessages = {
    calculating: 'Calculating grades from your answers...',
    generating: 'Generating AI analysis with Claude...',
    finalizing: 'Finalizing report...',
  };

  const displayMessage = message || stageMessages[stage];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">{displayMessage}</p>
          <p className="text-sm text-gray-500">This may take 10-30 seconds</p>
        </div>

        {/* Progress stages */}
        <div className="flex items-center space-x-4 pt-4">
          <Stage label="Calculate" active={stage === 'calculating'} completed={stage !== 'calculating'} />
          <Connector active={stage !== 'calculating'} />
          <Stage label="Generate" active={stage === 'generating'} completed={stage === 'finalizing'} />
          <Connector active={stage === 'finalizing'} />
          <Stage label="Finalize" active={stage === 'finalizing'} completed={false} />
        </div>
      </div>
    </div>
  );
}

interface StageProps {
  label: string;
  active: boolean;
  completed: boolean;
}

function Stage({ label, active, completed }: StageProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${
            completed
              ? 'bg-green-600 text-white'
              : active
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }
        `}
      >
        {completed ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-sm font-medium">{label[0]}</span>
        )}
      </div>
      <span className="mt-2 text-xs text-gray-600">{label}</span>
    </div>
  );
}

interface ConnectorProps {
  active: boolean;
}

function Connector({ active }: ConnectorProps) {
  return (
    <div
      className={`
        w-12 h-1 rounded-full transition-colors duration-200
        ${active ? 'bg-blue-600' : 'bg-gray-200'}
      `}
    ></div>
  );
}
