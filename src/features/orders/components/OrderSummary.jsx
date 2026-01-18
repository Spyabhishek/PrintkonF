import { ShoppingBag, Loader2 } from "lucide-react";

const OrderSummary = ({ cart, totalPrice, onPlaceOrder, isPlacingOrder, paymentMethod }) => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryCharge = 0; // Free delivery
    const platformFee = 0; // No platform fee
    const finalTotal = totalPrice + deliveryCharge + platformFee;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-start text-sm pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                        <div className="flex-1 pr-2">
                            <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                                {item.productName}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                Qty: {item.quantity} × ₹{item.productPrice}
                            </p>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0">
                            ₹{(item.productPrice * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">FREE</span>
                    ) : (
                        <span>₹{deliveryCharge.toFixed(2)}</span>
                    )}
                </div>

                {platformFee > 0 && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Platform Fee</span>
                        <span>₹{platformFee.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-700 mb-4">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Total Amount
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹{finalTotal.toFixed(2)}
                </span>
            </div>

            {/* Place Order Button */}
            <button
                onClick={onPlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-green-600 text-white py-3.5 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
                {isPlacingOrder ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
                    </>
                )}
            </button>

            {/* Security Badge */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 Secure checkout - Your data is protected
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;