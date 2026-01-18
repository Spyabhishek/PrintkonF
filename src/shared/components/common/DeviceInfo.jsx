import React, { useState, useEffect } from 'react';
import { getDeviceInfo, clearDeviceId } from '../../utils/deviceUtils';

const DeviceInfo = () => {
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setDeviceInfo(getDeviceInfo());
    }, []);

    const handleCopyDeviceId = async () => {
        if (deviceInfo?.deviceId) {
            try {
                await navigator.clipboard.writeText(deviceInfo.deviceId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy device ID:', err);
            }
        }
    };

    const handleResetDeviceId = () => {
        clearDeviceId();
        setDeviceInfo(getDeviceInfo());
    };

    if (!deviceInfo) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Device Information
            </h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Device ID
                    </label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 font-mono">
                            {deviceInfo.deviceId}
                        </code>
                        <button
                            onClick={handleCopyDeviceId}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        User Agent
                    </label>
                    <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 max-h-20 overflow-y-auto">
                        {deviceInfo.userAgent}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleResetDeviceId}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                        Generate New Device ID
                    </button>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        This will generate a new device ID and may require re-authentication on some services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeviceInfo;