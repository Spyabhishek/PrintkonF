import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roleService } from "../../../shared/services/roleService";

export default function UpgradeRole() {
    const [companyName, setCompanyName] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [customNote, setCustomNote] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        if (!companyName || !gstNumber || !customNote) {
            alert("All fields are required");
            return;
        }
        if (gstNumber.length !== 15) {
            alert("GST Number must be exactly 15 characters");
            return;
        }

        setLoading(true);
        try {
            await roleService.requestUpgrade({
                companyName,
                gstNumber,
                customNote
            });
            alert("Request submitted successfully! We've sent a confirmation email. Please check your inbox for details and next steps.");
            setCompanyName("");
            setGstNumber("");
            setCustomNote("");
        } catch {
            alert("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 
                           hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
                <span className="text-lg">←</span>
                Back
            </button>

            {/* Form */}
            <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 sm:p-6 
                                max-h-[calc(100vh-8rem)] overflow-y-auto transition-colors duration-300">

                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">
                        Request Role Upgrade
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-5">
                        Fill in your company details to request a role upgrade.
                    </p>

                    <form onSubmit={submit} className="space-y-3">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                           bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                                           placeholder-gray-400 dark:placeholder-gray-500 
                                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none"
                                placeholder="Your company name"
                                required
                            />
                        </div>

                        {/* GST Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                GST Number
                            </label>
                            <input
                                type="text"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                           bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                                           placeholder-gray-400 dark:placeholder-gray-500 
                                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none"
                                placeholder="15-digit GST Number"
                                required
                            />
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reason for Upgrade
                            </label>
                            <textarea
                                value={customNote}
                                onChange={(e) => setCustomNote(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                           bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                                           placeholder-gray-400 dark:placeholder-gray-500 
                                           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none resize-none"
                                placeholder="Explain why you need this upgrade..."
                                rows="3"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 
                                       text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Submit Request"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
