import React from 'react';
import { useCart } from '../../../shared/hooks/useCart';
import { useToastContext } from '../../../shared/context/ToastContext'; 
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const CartSummary = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const handleCheckout = () => {
    if (items.some(item => !item.available || !item.inStock)) {
      showToast('Please remove unavailable items before checkout', 'warning');
      return;
    }
    
    if (items.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }
    
    showToast('Proceeding to checkout...', 'success');
    navigate('/user/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleClearCart = async () => {
    if (items.length === 0) {
      showToast('Cart is already empty', 'info');
      return;
    }

    try {
      await clearCart();
      showToast('Cart cleared successfully', 'success');
    } catch (error) {
      showToast(`Failed to clear cart: ${error.message || 'Please try again'}`, 'error');
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h3>
          <Button onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      </Card>
    );
  }

  const hasUnavailableItems = items.some(item => !item.available || !item.inStock);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Order Summary
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Items:</span>
          <span>{totalItems}</span>
        </div>
        
        <div className="flex justify-between text-lg font-medium">
          <span className="text-gray-900 dark:text-white">Total:</span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleCheckout}
          className="w-full"
          disabled={hasUnavailableItems}
        >
          Proceed to Checkout
        </Button>
        
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="w-full"
        >
          Clear Cart
        </Button>
      </div>

      {hasUnavailableItems && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-3">
          * Some items in your cart are unavailable or out of stock. Please remove them to proceed.
        </p>
      )}
    </Card>
  );
};