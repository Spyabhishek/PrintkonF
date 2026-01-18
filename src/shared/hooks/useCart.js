import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  fetchCart, 
  addToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart,
  clearError 
} from '../../store/slices/cartSlice';
import { useToast } from './useToast';
import { useAuth } from './useAuth';

export const useCart = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const cartState = useSelector((state) => state.cart);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      showToast('Failed to load cart', 'error');
    }
  }, [dispatch, isAuthenticated, showToast]);

  const addItemToCart = useCallback(async (productId, quantity = 1, options = {}) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning');
      return false;
    }

    try {
      const cartItemData = { productId, quantity, options };
      await dispatch(addToCart(cartItemData)).unwrap();
      showToast('Item added to cart', 'success');
      return true;
    } catch (error) {
      showToast(error || 'Failed to add item to cart', 'error');
      return false;
    }
  }, [dispatch, isAuthenticated, showToast]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        await removeItemFromCart(cartItemId);
        return;
      }

      await dispatch(updateCartItemQuantity({ cartItemId, quantity })).unwrap();
    } catch (error) {
      showToast(error || 'Failed to update quantity', 'error');
    }
  }, [dispatch, showToast]);

  const removeItemFromCart = useCallback(async (cartItemId) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      showToast('Item removed from cart', 'success');
    } catch (error) {
      showToast(error || 'Failed to remove item from cart', 'error');
    }
  }, [dispatch, showToast]);

  const clearUserCart = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
      showToast('Cart cleared', 'success');
    } catch (error) {
      showToast(error || 'Failed to clear cart', 'error');
    }
  }, [dispatch, showToast]);

  const getCartItemCount = useCallback(() => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  }, [cartState.items]);

  const getItemQuantity = useCallback((productId) => {
    const item = cartState.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [cartState.items]);

  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    cartId: cartState.cartId,
    isLoading: cartState.isLoading,
    error: cartState.error,
    
    // Actions
    loadCart,
    addToCart: addItemToCart,
    updateQuantity,
    removeFromCart: removeItemFromCart,
    clearCart: clearUserCart,
    clearError: clearCartError,
    
    // Computed values
    getCartItemCount,
    getItemQuantity,
    
    // Convenience properties
    isEmpty: cartState.items.length === 0,
    itemCount: getCartItemCount()
  };
};