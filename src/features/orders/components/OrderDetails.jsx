// user/components/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Package,
    Clock,
    AlertCircle,
    Download,
    MessageCircle,
    Ban,
    MapPin,
    CreditCard,
    Truck,
    User,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useOrder, useCancelOrder } from '../../../shared/hooks/useOrder';
import StatusBadge from '../../../shared/components/feedback/StatusBadge';
import Card from '../../../shared/components/ui/Card';
import Loading from '../../../shared/components/ui/Loading';
import Modal from '../../../shared/components/ui/Modal';

const OrderDetails = () => {
    const { orderId } = useParams(); // This will now be a string like "ORD-20231201-1234"
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const { data: order, isLoading, error } = useOrder(orderId);
    const cancelOrderMutation = useCancelOrder();

    // Reset modal state when order changes
    useEffect(() => {
        if (order) {
            setShowCancelModal(false);
            setCancelReason('');
        }
    }, [order]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim() || !order) return;

        try {
            await cancelOrderMutation.mutateAsync({
                orderId: order.orderId, // UPDATED: Use orderId instead of id
                reason: cancelReason.trim()
            });

            // Close modal and reset state on success
            setShowCancelModal(false);
            setCancelReason('');
        } catch (error) {
            // Error is handled by the mutation, no need to close modal
            console.error('Failed to cancel order:', error);
        }
    };

    const canCancelOrder = () => {
        if (!order) return false;
        const cancellableStatuses = [
            'PENDING_PAYMENT',
            'UNDER_REVIEW',
            'APPROVED',
            'PROCESSING'
        ];
        return cancellableStatuses.includes(order.status);
    };

    const getStatusTimeline = () => {
        if (!order) return [];

        const timeline = [];

        // Order Created
        timeline.push({
            status: 'ORDER_PLACED',
            title: 'Order Placed',
            description: 'Your order has been successfully received',
            date: order.createdAt,
            completed: true,
            icon: CheckCircle2
        });

        // Payment Status
        if (order.paymentStatus === 'PAID') {
            timeline.push({
                status: 'PAYMENT_CONFIRMED',
                title: 'Payment Confirmed',
                description: 'Your payment has been processed successfully',
                date: order.createdAt,
                completed: true,
                icon: CheckCircle2
            });
        }

        // Order Status
        const statusEvents = {
            UNDER_REVIEW: {
                title: 'Under Review',
                description: 'Your order is being reviewed by our team'
            },
            APPROVED: {
                title: 'Approved',
                description: 'Order approved and ready for processing'
            },
            IN_PRODUCTION: {
                title: 'In Production',
                description: 'Your items are being prepared'
            },
            READY_FOR_DELIVERY: {
                title: 'Ready for Delivery',
                description: 'Order is ready for delivery'
            },
            OUT_FOR_DELIVERY: {
                title: 'Out for Delivery',
                description: 'Order is on its way to you'
            },
            DELIVERED: {
                title: 'Delivered',
                description: 'Order has been successfully delivered'
            },
            CANCELLED: {
                title: 'Cancelled',
                description: 'Order has been cancelled',
                icon: XCircle
            },
            REJECTED: {
                title: 'Rejected',
                description: 'Order has been rejected',
                icon: XCircle
            }
        };

        if (statusEvents[order.status]) {
            const event = statusEvents[order.status];
            timeline.push({
                status: order.status,
                title: event.title,
                description: event.description,
                date: order.updatedAt,
                completed: !['CANCELLED', 'REJECTED'].includes(order.status),
                icon: event.icon || CheckCircle2
            });
        }

        return timeline;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-96">
                        <Loading size="xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Orders</span>
                    </button>

                    <Card className="text-center p-8 max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {error ? 'Failed to Load Order' : 'Order Not Found'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error?.message || 'The order you\'re looking for doesn\'t exist.'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const timeline = getStatusTimeline();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Orders</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Order Header */}
                <Card className="p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex items-start gap-6 flex-1">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Order #{order.orderId} {/* UPDATED: Use orderId */}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                                    Placed on {formatDate(order.createdAt)}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{order.items?.length || 0} items</span>
                                    <span>•</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(order.orderTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={order.status} size="lg" />
                                <StatusBadge
                                    status={order.paymentStatus}
                                    size="md"
                                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Package className="w-6 h-6 text-blue-600" />
                                Order Items ({order.items?.length || 0})
                            </h2>

                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                                                {item.productName}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                {item.productDescription}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>Qty: {item.quantity}</span>
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                                {item.material && <span>Material: {item.material}</span>}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.totalPrice)}
                                                </span>
                                            </div>
                                            {item.customNote && (
                                                <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded-lg border border-blue-200 dark:border-blue-700">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Special Instructions:
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.customNote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Order Timeline */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                Order Timeline
                            </h2>

                            <div className="space-y-6">
                                {timeline.map((event, index) => (
                                    <div key={event.status} className="flex items-start gap-4">
                                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${event.completed
                                            ? 'bg-green-500'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {event.title}
                                                </h3>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 sm:mt-0 mt-1">
                                                    {formatDate(event.date)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Cancellation Reason */}
                        {order.cancellationReason && (
                            <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                                            Order Cancelled
                                        </h2>
                                        <p className="text-red-700 dark:text-red-300 leading-relaxed mb-2">
                                            {order.cancellationReason}
                                        </p>
                                        {order.cancelledAt && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                Cancelled on {formatDate(order.cancelledAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                                        #{order.orderId} {/* UPDATED: Use orderId */}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Payment</span>
                                    <StatusBadge status={order.paymentStatus} />
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Method</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(order.orderTotal)}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Shipping Information */}
                        {order.shippingAddress && (
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Shipping Address
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {order.shippingAddress.recipientName}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.shippingAddress.addressLine}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.shippingAddress.country}
                                    </p>
                                    {order.shippingAddress.deliveryInstructions && (
                                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                                                Delivery Instructions:
                                            </p>
                                            <p className="text-xs text-blue-700 dark:text-blue-400">
                                                {order.shippingAddress.deliveryInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                                    <Download className="w-5 h-5" />
                                    Download Invoice
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                                    <MessageCircle className="w-5 h-5" />
                                    Contact Support
                                </button>
                                {canCancelOrder() && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        disabled={cancelOrderMutation.isLoading}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Ban className="w-5 h-5" />
                                        {cancelOrderMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Cancellation Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                }}
                title={`Cancel Order #${order.orderId}`} // UPDATED: Use orderId
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reason for cancellation *
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Please provide a reason for cancellation..."
                            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            disabled={cancelOrderMutation.isLoading}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason('');
                            }}
                            disabled={cancelOrderMutation.isLoading}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            disabled={cancelOrderMutation.isLoading || !cancelReason.trim()}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {cancelOrderMutation.isLoading ? 'Cancelling...' : 'Confirm Cancel'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetails;