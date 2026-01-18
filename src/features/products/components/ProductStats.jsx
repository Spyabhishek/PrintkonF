// ============================================
// apps/user/components/ProductStats.jsx
// ============================================
import { Eye, ShoppingBag, Heart, Star, TrendingUp } from 'lucide-react';

const ProductStats = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      icon: ShoppingBag,
      label: 'Sales',
      value: stats.salesCount || 0,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Eye,
      label: 'Views',
      value: stats.viewsCount || 0,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Heart,
      label: 'Wishlist',
      value: stats.wishlistCount || 0,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: Star,
      label: 'Reviews',
      value: stats.reviewCount || 0,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Product Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} rounded-lg p-4 transition-transform hover:scale-105`}
          >
            <div className="flex items-center gap-3">
              <div className={`${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.averageRating && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Average Rating</span>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.averageRating.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ 5.0</span>
            </div>
          </div>
        </div>
      )}

      {stats.popularityScore && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Popularity Score</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.popularityScore.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStats;