import React, { useEffect } from 'react';
import { useCart } from '../../../shared/hooks/useCart';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useToastContext } from '../../../shared/context/ToastContext'; 
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import Loading from '../../../shared/components/ui/Loading';
import Button from '../../../shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CartPage = () => {
  const { items, isLoading, loadCart, error } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  // Load cart when component mounts
  useEffect(() => {
    console.log('CartPage - isAuthenticated:', isAuthenticated);
    console.log('CartPage - Current items:', items);
    
    if (isAuthenticated) {
      loadCart();
    } else {
      showToast('Please login to view your cart', 'warning');
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [loadCart, isAuthenticated, navigate, showToast]);

  // Show error toast if there's an error loading cart
  useEffect(() => {
    if (error) {
      showToast(`Failed to load cart: ${error}`, 'error');
    }
  }, [error, showToast]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  console.log('CartPage render - isLoading:', isLoading, 'items:', items, 'error:', error);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  // If user is not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button and Title */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
        </div>
        
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        // Empty Cart State - Full width
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
          <svg
            className="mx-auto h-32 w-32 text-gray-400 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContinueShopping}
              size="lg"
              className="min-w-[200px]"
            >
              Browse Products
            </Button>
            <Button
              variant="outline"
              onClick={handleBack}
              size="lg"
              className="min-w-[200px]"
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        // Cart with Items - Grid layout
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Cart Items ({items.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      loadCart();
                      showToast('Cart refreshed', 'success');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Refresh Cart
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;