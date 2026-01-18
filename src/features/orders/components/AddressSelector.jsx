import { MapPin, Plus, Check, Home, Building, MapPinHouse } from "lucide-react";
import { useState } from "react";

const AddressSelector = ({
    savedAddresses,
    selectedAddressId,
    onSelectAddress,
    showAddressForm,
    onToggleAddressForm,
    newAddress,
    onAddressChange,
    onSaveAddress
}) => {
    const [fieldErrors, setFieldErrors] = useState({});

    const handleFieldChange = (field, value) => {
        onAddressChange({ ...newAddress, [field]: value });
        // Clear error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getLabelIcon = (label) => {
        switch (label) {
            case 'Home': return <Home className="w-4 h-4" />;
            case 'Office': return <Building className="w-4 h-4" />;
            default: return <MapPinHouse className="w-4 h-4" />;
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = ['recipientName', 'phone', 'addressLine', 'city', 'state', 'zip'];

        requiredFields.forEach(field => {
            if (!newAddress[field]?.trim()) {
                errors[field] = `${field === 'zip' ? 'PIN Code' : field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
            }
        });

        // Phone number validation
        if (newAddress.phone && !/^\d{10}$/.test(newAddress.phone.replace(/\D/g, ''))) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }

        // PIN code validation
        if (newAddress.zip && !/^\d{6}$/.test(newAddress.zip)) {
            errors.zip = 'Please enter a valid 6-digit PIN code';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isFormValid = () => {
        const requiredFields = ['recipientName', 'phone', 'addressLine', 'city', 'state', 'zip'];
        return requiredFields.every(field => newAddress[field]?.trim());
    };

    const handleSave = () => {
        if (validateForm()) {
            onSaveAddress();
        }
    };

    const getInputClassName = (field) => {
        const baseClass = "w-full border rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent";
        return fieldErrors[field]
            ? `${baseClass} border-red-500 dark:border-red-500`
            : `${baseClass} border-gray-300 dark:border-gray-600`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                </h2>
                {!showAddressForm && (
                    <button
                        onClick={onToggleAddressForm}
                        className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add New
                    </button>
                )}
            </div>

            {/* Saved Addresses */}
            {!showAddressForm && savedAddresses.length > 0 && (
                <div className="space-y-4">
                    {savedAddresses.map((address) => (
                        <div
                            key={address.id}
                            onClick={() => onSelectAddress(address.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === address.id
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            {getLabelIcon(address.label)}
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {address.label}
                                            </span>
                                        </div>
                                        {address.isDefault && (
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                        {address.recipientName}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {address.phone}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                        {address.addressLine}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {address.city}, {address.state} - {address.zip}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                        {address.country}
                                    </p>
                                </div>
                                {selectedAddressId === address.id && (
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No saved addresses message */}
            {!showAddressForm && savedAddresses.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="mb-3">No saved addresses yet</p>
                    <button
                        onClick={onToggleAddressForm}
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add your first address
                    </button>
                </div>
            )}

            {/* Add New Address Form */}
            {showAddressForm && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={newAddress.recipientName}
                                onChange={(e) => handleFieldChange("recipientName", e.target.value)}
                                className={getInputClassName('recipientName')}
                            />
                            {fieldErrors.recipientName && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.recipientName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={newAddress.phone}
                                onChange={(e) => handleFieldChange("phone", e.target.value)}
                                className={getInputClassName('phone')}
                            />
                            {fieldErrors.phone && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Line *
                        </label>
                        <input
                            type="text"
                            placeholder="House no, building, street, area"
                            value={newAddress.addressLine}
                            onChange={(e) => handleFieldChange("addressLine", e.target.value)}
                            className={getInputClassName('addressLine')}
                        />
                        {fieldErrors.addressLine && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.addressLine}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    value={newAddress.city}
                                    onChange={(e) => handleFieldChange("city", e.target.value)}
                                    className={getInputClassName('city')}
                                />
                                {fieldErrors.city && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.city}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter state"
                                    value={newAddress.state}
                                    onChange={(e) => handleFieldChange("state", e.target.value)}
                                    className={getInputClassName('state')}
                                />
                                {fieldErrors.state && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.state}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    PIN Code *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter PIN code"
                                    value={newAddress.zip}
                                    onChange={(e) => handleFieldChange("zip", e.target.value)}
                                    className={getInputClassName('zip')}
                                    maxLength={6}
                                />
                                {fieldErrors.zip && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.zip}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value="India"
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compact Address Type at Bottom */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Address Type
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'Home', icon: Home, label: 'Home' },
                                { value: 'Office', icon: Building, label: 'Office' },
                                { value: 'Other', icon: MapPinHouse, label: 'Other' }
                            ].map(({ value, icon: Icon, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleFieldChange("label", value)}
                                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all flex-1 justify-center ${newAddress.label === value
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={newAddress.isDefault}
                                onChange={(e) => handleFieldChange("isDefault", e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            Set as default address
                        </label>

                        <div className="flex gap-3">
                            <button
                                onClick={onToggleAddressForm}
                                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isFormValid()}
                                className={`px-6 py-2.5 rounded-lg transition-colors font-medium ${isFormValid()
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;