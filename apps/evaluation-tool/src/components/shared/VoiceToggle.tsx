/**
 * VoiceToggle Component
 *
 * Toggle between "direct" and "suitable-for-work" voice modes.
 *
 * @version 1.0.0
 */

import { useTone } from '../../hooks/useTone';

export function VoiceToggle() {
  const { voiceMode, toggleVoiceMode } = useTone();

  const isDirect = voiceMode === 'no-bs';

  return (
    <button
      onClick={toggleVoiceMode}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      aria-label={`Switch to ${isDirect ? 'corporate' : 'no-bs'} mode`}
      data-testid="voice-mode-toggle"
    >
      <span className="text-sm font-medium text-gray-700">Voice Mode:</span>
      <span className={`text-sm font-semibold ${isDirect ? 'text-orange-600' : 'text-blue-600'}`}>
        {isDirect ? 'Direct' : 'Suitable for Work'}
      </span>
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    </button>
  );
}

/**
 * Compact version for mobile/small spaces
 */
export function VoiceToggleCompact() {
  const { voiceMode, toggleVoiceMode } = useTone();

  const isDirect = voiceMode === 'no-bs';

  return (
    <button
      onClick={toggleVoiceMode}
      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      aria-label={`Switch to ${isDirect ? 'corporate' : 'no-bs'} mode`}
      title={`Current: ${isDirect ? 'Direct' : 'Suitable for Work'}`}
      data-testid="voice-mode-toggle"
    >
      <svg
        className={`w-5 h-5 ${isDirect ? 'text-orange-600' : 'text-blue-600'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    </button>
  );
}
