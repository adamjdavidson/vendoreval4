/**
 * HeroSection Component
 *
 * Main hero section for the landing page with CTA.
 *
 * @version 1.0.0
 */

import { Button } from '../shared/Button';

interface HeroSectionProps {
  onStartEvaluation: () => void;
  onViewExample: () => void;
}

export function HeroSection({ onStartEvaluation, onViewExample }: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
        Evaluate AI Vendors with Confidence
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        A comprehensive 20-question assessment framework covering transparency, reliability,
        usability, adaptability, vendor stability, and learning resources.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={onStartEvaluation} variant="primary" size="lg">
          Start New Evaluation
        </Button>
        <Button onClick={onViewExample} variant="secondary" size="lg">
          View Example: Glean
        </Button>
      </div>
    </div>
  );
}
