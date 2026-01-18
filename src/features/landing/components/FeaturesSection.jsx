import { CheckCircle } from 'lucide-react';
import { useFeatures } from '../../../shared/hooks/useFeatures';

const FeaturesSection = () => {
  const { data: features = [], isLoading, isError } = useFeatures();

  if (isLoading) {
    return (
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-4"></div>
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-3"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !features.length) {
    return null;
  }

  const lastRowCount = features.length % 3;
  const shouldCenter = lastRowCount === 1;

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isLastCard = shouldCenter && index === features.length - 1;

            return (
              <div
                key={feature.id}
                className={`bg-gray-50 dark:bg-gray-900 p-6 rounded-xl hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 ${isLastCard ? 'md:col-start-2 lg:col-start-2' : ''
                  }`}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;