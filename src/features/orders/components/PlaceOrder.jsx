/**
 * DEPRECATED: This component is replaced by CheckoutPage.jsx
 * 
 * This file is kept for backward compatibility but should not be used.
 * Please use CheckoutPage.jsx instead which includes:
 * - Saved address management
 * - Razorpay integration
 * - Better validation
 * - Industry-standard checkout flow
 */

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PlaceOrder = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to new checkout page
        navigate("/checkout", { replace: true });
    }, [navigate]);

    return (
        <div className="p-6 text-center">
            <p>Redirecting to checkout...</p>
        </div>
    );
};

export default PlaceOrder;