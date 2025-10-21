/**
 * Landing Page
 *
 * Entry point for the AI Vendor Evaluation tool.
 * Allows users to:
 * - Start a new evaluation
 * - View pre-analyzed vendor examples
 * - Access documentation
 *
 * @version 1.0.0
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { VoiceToggle } from '../components/shared/VoiceToggle';
import { NewEvaluationModal } from '../components/evaluation/NewEvaluationModal';

export function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleStartNewEvaluation = () => {
    setShowModal(true);
  };

  const handleEvaluationCreated = (evaluationId: string) => {
    navigate(`/evaluate/${evaluationId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Vendor Evaluation</h1>
              <p className="text-sm text-gray-600 mt-1">
                Systematic framework for Fortune 500 executives
              </p>
            </div>
            <VoiceToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Evaluate AI Vendors with Confidence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A comprehensive 20-question assessment framework covering transparency, reliability,
            usability, adaptability, vendor stability, and learning resources.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleStartNewEvaluation} variant="primary" size="lg">
              Start New Evaluation
            </Button>
            <Link to="/vendors/glean">
              <Button variant="secondary" size="lg">
                View Example: Glean
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1: SEE */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">SEE</h3>
            <p className="text-sm text-gray-600 mb-2">Can you see how it works?</p>
            <p className="text-gray-700">
              Evaluate transparency into system behavior, prompts, models, and retrieval
              mechanisms.
            </p>
          </div>

          {/* Feature 2: CHANGE */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">CHANGE</h3>
            <p className="text-sm text-gray-600 mb-2">Can you change how it works?</p>
            <p className="text-gray-700">
              Assess customization options, parameter tuning, and model swapping capabilities.
            </p>
          </div>

          {/* Feature 3: USE */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">USE</h3>
            <p className="text-sm text-gray-600 mb-2">Can your team use it effectively?</p>
            <p className="text-gray-700">
              Evaluate ease of integration, UI quality, and operational complexity.
            </p>
          </div>

          {/* Feature 4: ADAPT */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ADAPT</h3>
            <p className="text-sm text-gray-600 mb-2">Can it adapt to your needs?</p>
            <p className="text-gray-700">
              Assess performance measurement, feedback integration, and continuous improvement.
            </p>
          </div>

          {/* Feature 5: LEAVE */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">LEAVE</h3>
            <p className="text-sm text-gray-600 mb-2">Can you leave if needed?</p>
            <p className="text-gray-700">
              Evaluate vendor stability, data portability, and exit strategy options.
            </p>
          </div>

          {/* Feature 6: LEARN */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">LEARN</h3>
            <p className="text-sm text-gray-600 mb-2">Can your team learn and grow?</p>
            <p className="text-gray-700">
              Assess documentation quality, training resources, and community support.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Evaluate Your Next AI Vendor?</h3>
          <p className="text-lg mb-6">
            Complete the 20-question assessment and get a comprehensive evaluation report in
            minutes.
          </p>
          <Button
            onClick={handleStartNewEvaluation}
            variant="secondary"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            AI Vendor Evaluation Framework &copy; {new Date().getFullYear()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Designed for Fortune 500 executives making critical AI vendor decisions
          </p>
        </div>
      </footer>

      {/* New Evaluation Modal */}
      <NewEvaluationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleEvaluationCreated}
      />
    </div>
  );
}
