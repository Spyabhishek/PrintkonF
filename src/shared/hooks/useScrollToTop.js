// src/shared/hooks/useScrollToTop.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle scroll-to-top behavior with production-ready features
 * @param {Object} options - Configuration options
 * @param {('auto'|'smooth')} options.behavior - Scroll behavior
 * @param {number} options.delay - Delay before scrolling in milliseconds
 * @param {boolean} options.enabled - Whether scrolling is enabled
 * @param {string[]} options.ignorePaths - Paths to ignore scroll behavior
 * @param {Function} options.onScrollStart - Callback before scrolling
 * @param {Function} options.onScrollComplete - Callback after scrolling
 */
export const useScrollToTop = (options = {}) => {
    const {
        behavior = 'smooth',
        delay = 0,
        enabled = true,
        ignorePaths = [],
        onScrollStart,
        onScrollComplete
    } = options;

    const { pathname } = useLocation();
    const isFirstRender = useRef(true);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {
        // Skip on first render to avoid unnecessary scroll
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Check if scrolling is disabled
        if (!enabled) {
            return;
        }

        // Check if current path should be ignored
        const shouldIgnore = ignorePaths.some(ignorePath => 
            pathname.includes(ignorePath) || pathname === ignorePath
        );

        if (shouldIgnore) {
            return;
        }

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Execute scroll with delay
        scrollTimeoutRef.current = setTimeout(() => {
            try {
                // Callback before scrolling
                if (onScrollStart) {
                    onScrollStart(pathname);
                }

                // Perform the scroll
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: behavior
                });

                // Callback after scrolling
                if (onScrollComplete) {
                    onScrollComplete(pathname);
                }

                // Log for debugging in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔄 ScrollToTop: Scrolled to top for ${pathname}`);
                }
            } catch (error) {
                console.error('❌ ScrollToTop: Failed to scroll to top:', error);
                
                // Fallback for browsers that don't support smooth scroll
                if (behavior === 'smooth') {
                    window.scrollTo(0, 0);
                }
            }
        }, delay);

        // Cleanup function
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [
        pathname,
        behavior,
        delay,
        enabled,
        ignorePaths.join(','), // Stringify array for dependency comparison
        onScrollStart,
        onScrollComplete
    ]);

    // Return manual scroll function for imperative use
    const manualScrollToTop = (customOptions = {}) => {
        const mergedOptions = { behavior, delay, ...customOptions };
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: mergedOptions.behavior
            });
        }, mergedOptions.delay);
    };

    return { manualScrollToTop };
};

export default useScrollToTop;