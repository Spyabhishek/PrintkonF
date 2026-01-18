// user/components/OrderHistory.jsx
import React, { useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    Package,
    Clock,
    AlertCircle,
    Plus,
    MapPin,
    CreditCard,
    Ban
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrders, useCancelOrder } from '../../../shared/hooks/useOrder';
import StatusBadge from '../../../shared/components/feedback/StatusBadge';
import Card from '../../../shared/components/ui/Card';
import Loading from '../../../shared/components/ui/Loading';
import Modal from '../../../shared/components/ui/Modal';

const OrderHistory = ({
    embedded = false,
    maxItems = null,
    showHeader = true,
    showBackButton = true,
    showCreateOrderButton = false
}) => {
    const navigate = useNavigate();
    const [cancelModalState, setCancelModalState] = useState({
        isOpen: false,
        order: null
    });

    const {
        data: orders = [],
        isLoading,
        error,
        refetch
    } = useOrders();

    const cancelOrderMutation = useCancelOrder();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
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

    const handleViewDetails = (orderId, e) => {
        e?.stopPropagation();
        navigate(`/user/orders/${orderId}`);
    };

    const handleCancelClick = (order, e) => {
        e.stopPropagation();
        setCancelModalState({
            isOpen: true,
            order
        });
    };

    const handleConfirmCancel = async (reason) => {
        if (!cancelModalState.order || !reason.trim()) return;

        try {
            await cancelOrderMutation.mutateAsync({
                orderId: cancelModalState.order.orderId, // UPDATED: Use orderId instead of id
                reason: reason.trim()
            });

            setCancelModalState({ isOpen: false, order: null });
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

    const handleCloseCancelModal = () => {
        setCancelModalState({ isOpen: false, order: null });
    };

    const canCancelOrder = (order) => {
        if (!order) return false;
        const cancellableStatuses = [
            'PENDING_PAYMENT',
            'UNDER_REVIEW',
            'APPROVED',
            'PROCESSING'
        ];
        return cancellableStatuses.includes(order.status);
    };

    const displayOrders = maxItems ? orders.slice(0, maxItems) : orders;

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center ${embedded ? 'min-h-32' : 'min-h-64'}`}>
                <Loading size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center ${embedded ? 'min-h-32' : 'min-h-64'}`}>
                <Card className="text-center p-6 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Failed to Load Orders
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {error.message || 'Unable to fetch your orders. Please try again.'}
                    </p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </Card>
            </div>
        );
    }

    const containerClass = embedded ? "" : "max-w-6xl mx-auto p-6";

    return (
        <>
            <div className={containerClass}>
                {/* Header Section */}
                {!embedded && showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                )}

                {showHeader && !embedded && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Order History
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {orders.length > 0
                                        ? `You have ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
                                        : 'Track and manage your orders'
                                    }
                                </p>
                            </div>
                            {showCreateOrderButton && (
                                <Link
                                    to="/user/place-order"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Order
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {displayOrders.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Orders Yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Your order history will appear here once you place an order.
                            </p>
                            {showCreateOrderButton && (
                                <Link
                                    to="/user/place-order"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Your First Order
                                </Link>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {displayOrders.map((order) => (
                            <Card
                                key={order.orderId} // UPDATED: Use orderId as key
                                className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                            >
                                {/* Order Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="flex items-start gap-4 flex-1 cursor-pointer"
                                        onClick={(e) => handleViewDetails(order.orderId, e)} // UPDATED: Use orderId
                                    >
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                    Order #{order.orderId} {/* UPDATED: Use orderId */}
                                                </h3>
                                                <StatusBadge status={order.status} size="sm" />
                                                <StatusBadge
                                                    status={order.paymentStatus}
                                                    size="sm"
                                                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(order.createdAt)}
                                                </span>
                                                <span>•</span>
                                                <span>{order.items?.length || 0} items</span>
                                                <span>•</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(order.orderTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleViewDetails(order.orderId, e)} // UPDATED: Use orderId
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-4"
                                    >
                                        <span className="font-medium text-sm">View Details</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>

                                {/* Order Items Preview */}
                                {order.items && order.items.length > 0 && (
                                    <div
                                        className="mb-4 cursor-pointer"
                                        onClick={(e) => handleViewDetails(order.orderId, e)} // UPDATED: Use orderId
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                                                >
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {item.productName}
                                                    </span>
                                                    <span className="text-gray-500">x{item.quantity}</span>
                                                    {item.size && (
                                                        <span className="text-gray-500">({item.size})</span>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-500">
                                                    +{order.items.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Order Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div
                                        className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                                        onClick={(e) => handleViewDetails(order.orderId, e)} // UPDATED: Use orderId
                                    >
                                        {order.shippingAddress && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate max-w-32">
                                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span>{order.paymentMethod}</span>
                                        </div>
                                        {order.estimatedDeliveryDate && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Est. {formatDate(order.estimatedDeliveryDate)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-2">
                                        {canCancelOrder(order) && (
                                            <button
                                                onClick={(e) => handleCancelClick(order, e)}
                                                disabled={cancelOrderMutation.isLoading}
                                                className="flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Ban className="w-4 h-4" />
                                                {cancelOrderMutation.isLoading && cancelModalState.order?.orderId === order.orderId ? 'Cancelling...' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Cancellation Reason */}
                                {order.cancellationReason && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                                    Order Cancelled
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                    {order.cancellationReason}
                                                </p>
                                                {order.cancelledAt && (
                                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                        Cancelled on {formatDate(order.cancelledAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* View More Link for Embedded Mode */}
                {embedded && maxItems && orders.length > maxItems && (
                    <div className="mt-6 text-center">
                        <Link
                            to="/user/orders"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            View All Orders ({orders.length})
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                )}
            </div>

            {/* Cancellation Modal */}
            <CancelOrderModal
                isOpen={cancelModalState.isOpen}
                order={cancelModalState.order}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
                isLoading={cancelOrderMutation.isLoading}
            />
        </>
    );
};

// Separate Cancel Order Modal Component
const CancelOrderModal = ({ isOpen, order, onClose, onConfirm, isLoading }) => {
    const [cancelReason, setCancelReason] = useState('');

    const handleConfirm = () => {
        onConfirm(cancelReason);
        setCancelReason('');
    };

    const handleClose = () => {
        onClose();
        setCancelReason('');
    };

    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
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
                        disabled={isLoading}
                    />
                </div>
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !cancelReason.trim()}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderHistory;