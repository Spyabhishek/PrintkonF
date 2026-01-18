// apps/user/components/PaymentMethodSelector.jsx - Simplified
import { Wallet, Banknote, CreditCard, QrCode } from "lucide-react";
import { PAYMENT_METHOD } from "../../../shared/services/orderService";

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
    const paymentOptions = [
        {
            id: PAYMENT_METHOD.COD,
            label: "Cash on Delivery",
            description: "Pay when you receive your order",
            icon: <Banknote className="w-6 h-6" />,
            badge: "No extra charges"
        },
        {
            id: PAYMENT_METHOD.RAZORPAY,
            label: "Pay Online",
            description: "UPI, Cards, Netbanking, Wallets",
            icon: <CreditCard className="w-6 h-6" />,
            badge: "Instant confirmation"
        }
        // Remove UPI and CARD options if they're not ready
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Payment Method
            </h2>

            <div className="space-y-3">
                {paymentOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => onSelectMethod(option.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMethod === option.id
                            ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <input
                                    type="radio"
                                    checked={selectedMethod === option.id}
                                    onChange={() => onSelectMethod(option.id)}
                                    className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`${selectedMethod === option.id
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                        {option.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                            {option.label}
                                        </p>
                                        {option.badge && (
                                            <span className="inline-block text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded mt-1">
                                                {option.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 ml-9">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Method Notices */}
            {selectedMethod === PAYMENT_METHOD.RAZORPAY && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💳 You'll be redirected to a secure payment gateway to complete your payment
                    </p>
                </div>
            )}

            {selectedMethod === PAYMENT_METHOD.COD && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        📦 Please keep exact change handy for a smooth delivery experience
                    </p>
                </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>🔒 All payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodSelector;