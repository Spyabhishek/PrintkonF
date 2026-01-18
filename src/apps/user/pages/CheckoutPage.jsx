import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../shared/hooks/useCart";
import { addressService } from "../../../shared/services/addressService";
import { orderService, PAYMENT_METHOD, ORDER_STATUS } from "../../../shared/services/orderService";
import AddressSelector from "../../../features/orders/components/AddressSelector";
import OrderSummary from "../../../features/orders/components/OrderSummary";
import PaymentMethodSelector from "../../../features/orders/components/PaymentMethodSelector";
import OrderStatusModal from "../../../features/orders/components/OrderStatusModal";
import { logger } from "../../../shared/utils/logger";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useToastContext } from "../../../shared/context/ToastContext";
import Loading from "../../../shared/components/ui/Loading";

const CheckoutPage = () => {
  // All hooks must be called unconditionally at the top level
  const { items, clearCart, loadCart, isLoading: isCartLoading, error: cartError, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  // Order status modal states
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderStatusMessage, setOrderStatusMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    label: "Home",
    isDefault: false
  });

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.COD);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [error, setError] = useState(null);

  // Memoized data fetching
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoadingAddresses(true);
      const response = await addressService.getMyAddresses();
      const addresses = response.data?.data || [];

      setSavedAddresses(addresses);

      // Auto-select logic
      const defaultAddr = addresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addresses.length > 0) {
        setSelectedAddressId(addresses[0].id);
      }
    } catch (err) {
      logger.error("Failed to fetch addresses:", err);
      setError("Failed to load addresses. Please refresh the page.");
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [isAuthenticated]);

  // Validation
  const validateOrder = useCallback(() => {
    if (!selectedAddressId && !showAddressForm) {
      setError("Please select or add a delivery address");
      return false;
    }

    if (showAddressForm) {
      const { recipientName, phone, addressLine, city, state, zip } = newAddress;
      const requiredFields = { recipientName, phone, addressLine, city, state, zip };

      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value?.trim())
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        setError(`Please fill all required fields: ${emptyFields.join(", ")}`);
        return false;
      }

      // Phone validation
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanPhone = phone.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        setError("Please enter a valid 10-digit Indian phone number");
        return false;
      }

      // ZIP validation
      if (!/^\d{6}$/.test(zip)) {
        setError("Please enter a valid 6-digit PIN code");
        return false;
      }
    }

    return true;
  }, [selectedAddressId, showAddressForm, newAddress]);

  // Initialize Razorpay payment
  const initializeRazorpayPayment = useCallback(async (order) => {
    try {
      logger.info("Initializing Razorpay for order:", order.orderId);
      // Temporary implementation
      return { success: true };
    } catch (error) {
      logger.error("Razorpay initialization error:", error);
      return {
        success: false,
        error: error.message || "Payment gateway error"
      };
    }
  }, []);

  // NEW: Handle order completion with modal
  const handleOrderCompletion = useCallback(async (order, message, status) => {
    try {
      // Clear cart first
      await clearCart();
      
      // Set order status data for modal
      setPlacedOrder(order);
      setOrderStatus(status);
      setOrderStatusMessage(message);
      
      // Show order status modal
      setShowOrderStatus(true);
      
    } catch (clearCartError) {
      logger.warn("Failed to clear cart after order placement:", clearCartError);
      // Still show success modal even if cart clearing fails
      setPlacedOrder(order);
      setOrderStatus(status);
      setOrderStatusMessage(`${message} (Note: Cart may not have been cleared)`);
      setShowOrderStatus(true);
    }
  }, [clearCart]);

  // UPDATED: Online payment handler to use modal
  const handleOnlinePayment = useCallback(async (order) => {
    try {
      logger.event("online_payment_initiated", { orderId: order.orderId });

      if (paymentMethod === PAYMENT_METHOD.RAZORPAY) {
        const paymentResponse = await initializeRazorpayPayment(order);

        if (paymentResponse.success) {
          await handleOrderCompletion(
            order,
            "Order placed! Please complete the payment.",
            ORDER_STATUS.PENDING_PAYMENT
          );
        } else {
          throw new Error(paymentResponse.error || "Payment initialization failed");
        }
      } else {
        await handleOrderCompletion(
          order,
          "Order placed! Please complete the payment.",
          ORDER_STATUS.PENDING_PAYMENT
        );
      }
    } catch (error) {
      logger.error("Payment initialization failed:", error);

      // Show modal with payment failure but order success
      setPlacedOrder(order);
      setOrderStatus(ORDER_STATUS.PAYMENT_FAILED);
      setOrderStatusMessage("Order placed! However, payment initialization failed. Please check your orders page to complete payment.");
      setShowOrderStatus(true);
      
      throw error;
    }
  }, [paymentMethod, initializeRazorpayPayment, handleOrderCompletion]);

  // NEW: Handle modal close
  const handleCloseOrderStatus = () => {
    setShowOrderStatus(false);
    // Optional: Clear the order data after modal is closed
    setTimeout(() => {
      setPlacedOrder(null);
      setOrderStatus(null);
      setOrderStatusMessage("");
    }, 300);
  };

  // Authentication and initialization
  useEffect(() => {
    console.log('CheckoutPage - isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      loadCart();
      fetchAddresses();
    } else {
      showToast('Please login to proceed to checkout', 'warning');
      navigate('/login');
    }
  }, [loadCart, isAuthenticated, navigate, showToast, fetchAddresses]);

  // Show error toast if there's an error loading cart
  useEffect(() => {
    if (cartError) {
      showToast(`Failed to load cart: ${cartError}`, 'error');
    }
  }, [cartError, showToast]);

  // Auto-hide error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ===== CONDITIONAL RENDERING - AFTER ALL HOOKS =====

  // If user is not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while cart is loading
  if (isCartLoading || isLoadingAddresses) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Loading />
      </div>
    );
  }

  // Empty cart state - THIS IS WHY YOU SEE "CART IS EMPTY"
  // The cart gets cleared after successful order, so we need to handle this differently
  if (!isCartLoading && (!items || items.length === 0) && !showOrderStatus) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Your cart is empty 🛒
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Save new address
  const handleSaveNewAddress = async () => {
    try {
      setError(null);
      await addressService.createAddress(newAddress);
      await fetchAddresses();
      setShowAddressForm(false);

      // Reset form
      setNewAddress({
        recipientName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        label: "Home",
        isDefault: false
      });
    } catch (err) {
      logger.error("Failed to save address:", err);
      setError(err.response?.data?.message || "Failed to save address. Please try again.");
    }
  };

  // FIXED: Enhanced order placement with modal integration
  const handlePlaceOrder = async () => {
    setError(null);

    if (!validateOrder()) return;

    setIsPlacingOrder(true);
    let orderPlacedSuccessfully = false;
    let placedOrderData = null;

    try {
      // Build order payload
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || null,
          customNote: item.customNote || null
        })),
        paymentMethod: paymentMethod,
        deliveryInstructions: deliveryInstructions || null,
        shippingAddressId: !showAddressForm ? selectedAddressId : null,
        ...(showAddressForm && {
          shippingAddress: {
            recipientName: newAddress.recipientName,
            phone: newAddress.phone,
            addressLine: newAddress.addressLine,
            city: newAddress.city,
            state: newAddress.state,
            zip: newAddress.zip,
            country: newAddress.country
          }
        })
      };

      logger.info("Placing order with payload:", orderPayload);

      // API call with timeout
      const response = await Promise.race([
        orderService.placeOrder(orderPayload),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]);

      const order = response.data?.data;

      if (!order || !order.orderId) {
        throw new Error('Invalid order response from server');
      }

      logger.info("Order placed successfully:", order);
      orderPlacedSuccessfully = true;
      placedOrderData = order;

      // FIXED: Use handleOrderCompletion instead of handleSuccessfulOrder
      if (paymentMethod === PAYMENT_METHOD.COD) {
        await handleOrderCompletion(order, "Order placed successfully! Pay on delivery.", ORDER_STATUS.CONFIRMED);
      } else {
        // Online payment flow
        await handleOnlinePayment(order);
      }

    } catch (err) {
      logger.error("Order placement failed:", err);

      if (orderPlacedSuccessfully && placedOrderData) {
        // Order was placed but something failed in UI flow
        setPlacedOrder(placedOrderData);
        setOrderStatus(ORDER_STATUS.CONFIRMED);
        setOrderStatusMessage("Order placed successfully, but there was an issue with the confirmation.");
        setShowOrderStatus(true);
      } else {
        // Genuine order placement failure - show error in modal
        setPlacedOrder(null);
        setOrderStatus(ORDER_STATUS.FAILED);
        setOrderStatusMessage(
          err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
        );
        setShowOrderStatus(true);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <AddressSelector
            savedAddresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            showAddressForm={showAddressForm}
            onToggleAddressForm={() => {
              setShowAddressForm(!showAddressForm);
              setError(null);
            }}
            newAddress={newAddress}
            onAddressChange={setNewAddress}
            onSaveAddress={handleSaveNewAddress}
            isLoading={isLoadingAddresses}
          />

          {/* Delivery Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Delivery Instructions (Optional)
            </h2>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="E.g., Leave at door, Call before delivery, Security instructions..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {deliveryInstructions.length}/500 characters
            </div>
          </div>

          {/* Payment Method */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            cart={items}
            totalPrice={totalAmount}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            paymentMethod={paymentMethod}
            isLoading={isCartLoading}
          />
        </div>
      </div>

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={showOrderStatus}
        onClose={handleCloseOrderStatus}
        order={placedOrder}
        status={orderStatus}
        message={orderStatusMessage}
      />
    </div>
  );
};

export default CheckoutPage;