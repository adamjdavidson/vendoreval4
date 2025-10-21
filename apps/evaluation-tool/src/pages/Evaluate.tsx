/**
 * Evaluate Page
 *
 * Main evaluation interface where users answer the 20 questions.
 * Features:
 * - Progress tracking
 * - Category-based grading with live updates
 * - Voice mode toggle
 * - Report generation
 *
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTone } from '../hooks/useTone';
import { databaseService } from '../services/database';
import { VoiceToggle } from '../components/shared/VoiceToggle';
import { Question } from '../components/evaluation/Question';
import { CategoryBox } from '../components/evaluation/CategoryBox';
import { ExportButton } from '../components/evaluation/ExportButton';
import { Button } from '../components/shared/Button';
import { calculateAllGrades, generateBottomLine, getOverallAssessmentColor } from '../utils/grading';
import type { Evaluation, Category, Question as QuestionType, AnswerValue } from "@shared/types";

// Helper to convert null to undefined
function nullToUndefined(value: string | null | undefined): string | undefined {
  return value === null ? undefined : value;
}

export function EvaluatePage() {
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const { user } = useAuth();
  const { voiceMode } = useTone();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load evaluation data
  useEffect(() => {
    if (!user || !evaluationId) {
      navigate('/');
      return;
    }

    loadEvaluationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, evaluationId]);

  const loadEvaluationData = async () => {
    if (!evaluationId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load evaluation, categories, and questions in parallel
      const [evalData, categoriesData, questionsData] = await Promise.all([
        databaseService.getUserEvaluations(user.id),
        databaseService.getCategories(),
        databaseService.getQuestions(),
      ]);

      const currentEval = evalData.find((e) => e.id === evaluationId);

      if (!currentEval) {
        setError('Evaluation not found');
        return;
      }

      setEvaluation(currentEval as unknown as Evaluation);
      setCategories(categoriesData as unknown as Category[]);
      setQuestions(questionsData as unknown as QuestionType[]);
    } catch (err) {
      console.error('Failed to load evaluation:', err);
      setError('Failed to load evaluation');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswer = async (questionId: string, answer: AnswerValue, notes?: string) => {
    if (!evaluation) return;

    // Update local state immediately for responsive UI
    const updatedAnswers = evaluation.answers.filter((a) => a.question_id !== questionId);
    updatedAnswers.push({
      question_id: questionId,
      answer,
      notes,
      timestamp: new Date().toISOString(),
    });

    const updatedEvaluation = { ...evaluation, answers: updatedAnswers };
    setEvaluation(updatedEvaluation);

    // Save to database
    try {
      await databaseService.updateEvaluation(evaluation.id, updatedAnswers);
    } catch (err) {
      console.error('Failed to save answer:', err);
      // Optionally show error to user
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Evaluation not found'}</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.round((evaluation.answers.length / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Simple evaluation questionnaire to ask the vendor salesperson
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Evaluating: <span className="font-medium">{evaluation.vendor_name}</span> • {evaluation.answers.length}/{questions.length} questions answered ({completionPercentage}%)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <VoiceToggle />
              <Button onClick={() => navigate('/')} variant="ghost" size="sm">
                Exit
              </Button>
            </div>
          </div>

          {/* Compact Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Questions by Category - Each category in a colored box */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryQuestions = questions.filter((q) => q.category_id === category.id);
            const title = voiceMode === 'no-bs' ? category.title_no_bs : category.title_corporate;
            const subtitle = voiceMode === 'no-bs' ? category.subtitle_no_bs : category.subtitle_corporate;

            return (
              <section
                key={category.key}
                className="rounded-lg p-6 border-2 border-gray-300"
                style={{ backgroundColor: category.color }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  <p className="text-base text-gray-700 mt-1">{subtitle}</p>
                </div>

                {/* Questions in 2-column grid */}
                <div className="grid md:grid-cols-2 gap-3">
                  {categoryQuestions.map((question) => {
                    const answer = evaluation.answers.find((a) => a.question_id === question.id);
                    return (
                      <Question
                        key={question.id}
                        question={question}
                        value={answer?.answer || null}
                        note={answer?.notes || ''}
                        onChange={(value) => updateAnswer(question.id, value, nullToUndefined(answer?.notes))}
                        onNoteChange={(note) => updateAnswer(question.id, answer?.answer ?? 'not-enough-info', note)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Category Evaluation Summary - Show when 85%+ complete */}
        {completionPercentage >= 85 && (
          <section className="mt-12 mb-8" data-testid="category-summary">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Evaluation Summary</h2>

            {/* Category Grades Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {calculateAllGrades(categories, questions, evaluation.answers).map((categoryGrade) => (
                <CategoryBox
                  key={categoryGrade.category.key}
                  category={categoryGrade.category}
                  grade={categoryGrade.grade}
                />
              ))}
            </div>

            {/* Bottom Line Synthesis */}
            {(() => {
              const allGrades = calculateAllGrades(categories, questions, evaluation.answers);
              const assessmentColor = getOverallAssessmentColor(allGrades);

              const colorStyles = {
                red: 'bg-red-50 border-red-600',
                yellow: 'bg-yellow-50 border-yellow-600',
                green: 'bg-green-50 border-green-600',
              };

              return (
                <div className={`rounded-lg shadow-lg p-8 border-4 ${colorStyles[assessmentColor]}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bottom Line</h3>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {generateBottomLine(evaluation.vendor_name, allGrades, voiceMode)}
                  </p>
                </div>
              );
            })()}
          </section>
        )}

        {/* Export Section */}
        <section className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Export Your Evaluation?</h2>
          <p className="text-gray-600 mb-6">
            {completionPercentage === 100
              ? "You've completed all questions! Export your comprehensive evaluation report."
              : `You've answered ${evaluation.answers.length} out of ${questions.length} questions. You can export anytime.`}
          </p>
          <div className="flex gap-4 justify-center">
            <ExportButton
              evaluation={evaluation}
              categories={categories}
              questions={questions}
              disabled={evaluation.answers.length === 0}
            />
            <Button onClick={() => navigate('/')} variant="secondary" size="lg">
              Save & Exit
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
