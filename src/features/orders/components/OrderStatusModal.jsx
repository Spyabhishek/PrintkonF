import { useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { ORDER_STATUS } from "../../../shared/services/orderService";

const OrderStatusModal = ({
    isOpen,
    onClose,
    order,
    status,
    message,
    paymentStatus
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getStatusConfig = () => {
        switch (status) {
            case ORDER_STATUS.CONFIRMED:
                return {
                    icon: CheckCircle,
                    iconColor: "text-green-500",
                    bgColor: "bg-green-50 dark:bg-green-900/20",
                    borderColor: "border-green-200 dark:border-green-800",
                    title: "Order Placed Successfully!",
                    description: "Your order has been confirmed and is being processed."
                };
            case ORDER_STATUS.PENDING_PAYMENT:
                return {
                    icon: Clock,
                    iconColor: "text-yellow-500",
                    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                    borderColor: "border-yellow-200 dark:border-yellow-800",
                    title: "Payment Pending",
                    description: "Your order is placed. Please complete the payment."
                };
            case ORDER_STATUS.PAYMENT_FAILED:
                return {
                    icon: AlertCircle,
                    iconColor: "text-red-500",
                    bgColor: "bg-red-50 dark:bg-red-900/20",
                    borderColor: "border-red-200 dark:border-red-800",
                    title: "Payment Failed",
                    description: "Order placed but payment failed. You can retry payment."
                };
            case ORDER_STATUS.FAILED:
                return {
                    icon: XCircle,
                    iconColor: "text-red-500",
                    bgColor: "bg-red-50 dark:bg-red-900/20",
                    borderColor: "border-red-200 dark:border-red-800",
                    title: "Order Failed",
                    description: "We couldn't process your order. Please try again."
                };
            default:
                return {
                    icon: Clock,
                    iconColor: "text-blue-500",
                    bgColor: "bg-blue-50 dark:bg-blue-900/20",
                    borderColor: "border-blue-200 dark:border-blue-800",
                    title: "Processing Order",
                    description: "Your order is being processed."
                };
        }
    };

    const statusConfig = getStatusConfig();
    const IconComponent = statusConfig.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className={`relative w-full max-w-md ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-2xl shadow-xl`}>
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <IconComponent className={`w-16 h-16 ${statusConfig.iconColor}`} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {statusConfig.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {message || statusConfig.description}
                    </p>

                    {order && (
                        <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                            <p className="font-mono font-bold text-gray-800 dark:text-gray-200">
                                #{order.orderId}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-6">
                        {status === ORDER_STATUS.PENDING_PAYMENT || status === ORDER_STATUS.PAYMENT_FAILED ? (
                            <>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/orders", {
                                            state: {
                                                orderId: order?.orderId,
                                                requiresPayment: true
                                            }
                                        });
                                    }}
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Complete Payment
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    View Orders Later
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/orders", { state: { orderId: order?.orderId } });
                                    }}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    View Order Details
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/products");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusModal;