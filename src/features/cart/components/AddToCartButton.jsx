import React, { useState } from 'react';
import { useCart } from '../../../shared/hooks/useCart';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useToastContext } from "../../../shared/context/ToastContext";
import Button from '../../../shared/components/ui/Button';

export const AddToCartButton = ({ 
  productId, 
  productName, 
  quantity = 1, 
  options = {},
  className = '',
  variant = 'primary',
  size = 'md',
  showQuantity = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, getItemQuantity, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToastContext(); 

  const currentQuantity = getItemQuantity(productId);

  const handleAddToCart = async (e) => {
    // Stop event from bubbling to parent Link
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning');
      return;
    }

    setIsAdding(true);
    try {
      const success = await addToCart(productId, quantity, options);
      if (success) {
        showToast(`${productName} added to cart`, 'success');
      }
      // Error handling is done in the cart hook, so we don't need to show error here
    } catch (error) {
      // Error is already handled by the cart hook
      console.error('Add to cart error:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isButtonLoading = isAdding || isLoading;

  if (showQuantity && currentQuantity > 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium">
          In cart: {currentQuantity}
        </span>
        <Button
          onClick={handleAddToCart}
          variant={variant}
          size={size}
          disabled={isButtonLoading}
          className={isButtonLoading ? 'opacity-60' : ''}
        >
          {isButtonLoading ? 'Adding...' : 'Add More'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      disabled={isButtonLoading}
      className={`${className} ${isButtonLoading ? 'opacity-60' : ''}`}
    >
      {isButtonLoading ? 'Adding to Cart...' : 'Add to Cart'}
    </Button>
  );
};