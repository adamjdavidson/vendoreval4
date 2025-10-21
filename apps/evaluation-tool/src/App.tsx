/**
 * Main App Component with React Router
 *
 * Routes:
 * - / : Landing page
 * - /evaluate : Evaluation tool
 * - /vendors/:name : Pre-analyzed vendor detail
 *
 * @version 1.0.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToneProvider } from './contexts/ToneContext';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/Landing').then(m => ({ default: m.LandingPage })));
const EvaluatePage = lazy(() => import('./pages/Evaluate').then(m => ({ default: m.EvaluatePage })));

// Placeholder components - will be implemented in Phase 3

function VendorDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Detail</h1>
      <p className="text-gray-600">Vendor detail page will be implemented in Phase 5</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <a href="/" className="text-blue-600 hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToneProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/evaluate/:evaluationId" element={<EvaluatePage />} />
              <Route path="/vendors/:name" element={<VendorDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ToneProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
