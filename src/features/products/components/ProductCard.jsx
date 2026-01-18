// apps/user/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import Image from '../../../shared/components/ui/Image';
import {
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  Package,
  Eye,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { AddToCartButton } from '../../cart/components/AddToCartButton';

const ProductCard = ({ product }) => {
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    try {
      setIsBuyNowLoading(true);
    } catch (error) {
      console.error('Failed to proceed with buy now:', error);
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      to={`/products/${product.productId}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={product.mainImageUrl || product.imageUrls?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isPopular && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium shadow-lg">
              <Star className="w-3 h-3" />
              Popular
            </span>
          )}
          {product.isForceTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
          {!product.inStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-white rounded-full text-xs font-medium shadow-lg">
              Out of Stock
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Quick View
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        {product.categoryName && (
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2 uppercase tracking-wide">
            {product.categoryName}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Stats */}
        {product.stats && (
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
            {product.stats.averageRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {product.stats.averageRating.toFixed(1)}
                </span>
                <span className="text-xs">
                  ({product.stats.reviewCount})
                </span>
              </div>
            )}
            {product.stats.salesCount > 0 && (
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{product.stats.salesCount} sold</span>
              </div>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(product.price)}
              </div>
              {product.inStock && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {product.stockQuantity} in stock
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock || isBuyNowLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${product.inStock
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              {isBuyNowLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isBuyNowLoading ? 'Processing...' : 'Buy Now'}
            </button>
        </div>
         </div>
              <div className="mt-4">
              <AddToCartButton
                productId={product.productId}
                productName={product.name}
                className="w-full"
                size="sm"
              />
            </div>
      </div>

      {/* Loading Overlay */}
      {(isBuyNowLoading) && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;