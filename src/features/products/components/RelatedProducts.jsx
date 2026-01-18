// ============================================
// apps/user/components/RelatedProducts.jsx
// ============================================
import { useProducts } from '../../../shared/hooks/useProducts';
import ProductCard from './ProductCard';
import Loading from '../../../shared/components/ui/Loading';

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const { data, isLoading } = useProducts({
    categoryId,
    page: 0,
    size: 8,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  });

  const relatedProducts = data?.data?.content?.filter(
    product => product.productId !== currentProductId
  ).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="py-8">
        <Loading size="md" />
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;