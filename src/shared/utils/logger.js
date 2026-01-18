// shared/utils/logger.js

/**
 * Production-grade minimal logger
 * - No external dependencies
 * - Environment-aware (quiet in production)
 * - Structured logging
 */
class FrontendLogger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  info(message, data = null) {
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, data || '');
    }
    // In production, you might send to analytics instead
  }

  error(message, error = null) {
    // Always log errors, but format differently
    if (this.isDevelopment) {
      console.error(`❌ [ERROR] ${message}`, error || '');
    } else {
      console.error(`[ERROR] ${message}`); // Quiet in production
      // Send critical errors to your monitoring service
      this.sendToMonitoring(message, error);
    }
  }

  warn(message, data = null) {
    if (this.isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, data || '');
    }
  }

  // For user journey tracking (very useful for debugging)
  event(action, data = null) {
    if (this.isDevelopment) {
      console.log(`🎯 [EVENT] ${action}`, data || '');
    }
    // In production: send to analytics (Google Analytics, Mixpanel, etc.)
  }

  // Send critical errors to your monitoring service
  sendToMonitoring(message, error) {
    // Example: Send to Sentry, LogRocket, or your backend
    // This is optional but recommended for production
    try {
      // You can send to your backend or external service
      fetch('/api/client-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          error: error?.toString(),
          stack: error?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {}); // Fail silently
    } catch (e) {
      // Don't break the app if logging fails
    }
  }
}

export const logger = new FrontendLogger();