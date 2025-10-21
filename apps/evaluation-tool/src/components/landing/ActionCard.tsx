/**
 * ActionCard Component
 *
 * Feature card for landing page showcasing categories.
 *
 * @version 1.0.0
 */

interface ActionCardProps {
  title: string;
  subtitle: string;
  description: string;
  borderColor: string;
}

export function ActionCard({ title, subtitle, description, borderColor }: ActionCardProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${borderColor}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
