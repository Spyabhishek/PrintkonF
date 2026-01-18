
/**
 * Generate a unique device ID that persists in localStorage
 * @returns {string} Device ID
 */
export const getDeviceId = () => {
  const DEVICE_ID_KEY = 'device_id';
  
  try {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Generate a new UUID-like device ID
      deviceId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    // If localStorage is not available, generate a session-only device ID
    console.warn('localStorage not available, using session-only device ID');
    return generateUUID();
  }
};

/**
 * Get user agent string (truncated to 512 characters as per backend validation)
 * @returns {string} User agent string
 */
export const getUserAgent = () => {
  const userAgent = navigator.userAgent || 'Unknown';
  // Truncate to 512 characters to match backend validation
  return userAgent.substring(0, 512);
};

/**
 * Generate a UUID v4
 * @returns {string} UUID
 */
const generateUUID = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get device info object for authentication requests
 * @returns {Object} Device info with deviceId and userAgent
 */
export const getDeviceInfo = () => {
  return {
    deviceId: getDeviceId(),
    userAgent: getUserAgent()
  };
};

/**
 * Clear stored device ID (useful for logout or reset)
 */
export const clearDeviceId = () => {
  try {
    localStorage.removeItem('device_id');
  } catch (error) {
    console.warn('Could not clear device ID from localStorage');
  }
};