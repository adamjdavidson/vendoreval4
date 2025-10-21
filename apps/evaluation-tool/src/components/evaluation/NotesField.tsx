/**
 * NotesField Component
 *
 * Optional notes textarea for question answers.
 *
 * @version 1.0.0
 */

interface NotesFieldProps {
  questionId: string;
  value: string;
  onChange: (value: string) => void;
}

const MAX_NOTE_LENGTH = 5000;

export function NotesField({ questionId, value, onChange }: NotesFieldProps) {
  const remainingChars = MAX_NOTE_LENGTH - value.length;
  const isNearLimit = remainingChars < 500;
  const isAtLimit = remainingChars <= 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_NOTE_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <div className="mt-4">
      <label
        htmlFor={`note-${questionId}`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Notes (optional)
      </label>
      <textarea
        id={`note-${questionId}`}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
        placeholder="Add any notes or context..."
        maxLength={MAX_NOTE_LENGTH}
      />
      <div className="mt-1 text-right">
        <span
          className={`text-xs ${
            isAtLimit
              ? 'text-red-600 font-semibold'
              : isNearLimit
                ? 'text-yellow-600'
                : 'text-gray-500'
          }`}
        >
          {remainingChars} characters remaining
        </span>
      </div>
    </div>
  );
}
