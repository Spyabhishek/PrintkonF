import React from 'react';
import { useCart } from '../../../shared/hooks/useCart';
import { useToastContext } from '../../../shared/context/ToastContext'; 
import Button from '../../../shared/components/ui/Button';
import Image from '../../../shared/components/ui/Image';
import ImagePlaceholder from '../../../shared/components/ui/ImagePlaceholder';

export const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { showToast } = useToastContext();

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity === 0) {
            await handleRemove();
            return;
        }
        
        try {
            await updateQuantity(item.id, newQuantity);
            showToast(`Updated ${item.productName} quantity to ${newQuantity}`, 'success');
        } catch (error) {
            showToast(`Failed to update quantity: ${error.message || 'Please try again'}`, 'error');
        }
    };

    const handleRemove = async () => {
        try {
            await removeFromCart(item.id);
            showToast(`${item.productName} removed from cart`, 'success');
        } catch (error) {
            showToast(`Failed to remove item: ${error.message || 'Please try again'}`, 'error');
        }
    };

    const handleDecreaseQuantity = () => {
        if (item.quantity === 1) {
            showToast(`Removing ${item.productName} from cart`, 'info');
        }
        handleQuantityChange(item.quantity - 1);
    };

    const handleIncreaseQuantity = () => {
        handleQuantityChange(item.quantity + 1);
    };

    // Format price with Indian Rupee symbol
    const formatPrice = (price) => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Product Image */}
            <div className="flex-shrink-0 w-16 h-16">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <ImagePlaceholder className="w-full h-full rounded-lg" />
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.productName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(item.productPrice)}
                </p>

                {/* Options */}
                {item.options && Object.keys(item.options).length > 0 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {Object.entries(item.options).map(([key, value]) => (
                            <div key={key}>
                                {key}: {String(value)}
                            </div>
                        ))}
                    </div>
                )}

                {/* Availability */}
                {(!item.available || !item.inStock) && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {!item.available ? 'Not available' : 'Out of stock'}
                    </p>
                )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecreaseQuantity}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 p-0"
                >
                    -
                </Button>

                <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncreaseQuantity}
                    className="w-8 h-8 p-0"
                >
                    +
                </Button>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
                Remove
            </Button>
        </div>
    );
};