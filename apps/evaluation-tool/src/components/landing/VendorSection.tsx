/**
 * VendorSection Component
 *
 * Section showing pre-analyzed vendor examples.
 *
 * @version 1.0.0
 */

import { Link } from 'react-router-dom';
import { Button } from '../shared/Button';

export function VendorSection() {
  return (
    <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
      <h3 className="text-3xl font-bold mb-4">Ready to Evaluate Your Next AI Vendor?</h3>
      <p className="text-lg mb-6">
        Complete the 20-question assessment and get a comprehensive evaluation report in minutes.
      </p>
      <Link to="/vendors/glean">
        <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
          View Example: Glean Evaluation
        </Button>
      </Link>
    </div>
  );
}
