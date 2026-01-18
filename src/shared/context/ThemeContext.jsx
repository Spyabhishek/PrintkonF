import React, { createContext, useEffect, useState, useRef, useMemo } from "react";

export const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.__THEME_PROVIDER_COUNT = (window.__THEME_PROVIDER_COUNT || 0) + 1;
            const count = window.__THEME_PROVIDER_COUNT;
            if (count > 1) {
                console.warn(`[ThemeProvider] detected ${count} ThemeProvider instances mounted.`);
            }
            return () => {
                window.__THEME_PROVIDER_COUNT = Math.max(0, window.__THEME_PROVIDER_COUNT - 1);
            };
        }
        return undefined;
    }, []);

    const getInitialTheme = () => {
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "dark" || saved === "light") return saved;
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        } catch (e) {
        }
        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const lastLoggedRef = useRef(null);

    useEffect(() => {
        try {
            const html = document.documentElement;
            const htmlHasDark = html.classList.contains("dark");

            if (theme === "dark" && !htmlHasDark) {
                html.classList.add("dark");
            } else if (theme !== "dark" && htmlHasDark) {
                html.classList.remove("dark");
            }

            const stored = localStorage.getItem("theme");
            if (stored !== theme) {
                localStorage.setItem("theme", theme);
            }

            if (lastLoggedRef.current !== theme) {
                console.log("Theme:", theme, "isDarkClassApplied:", html.classList.contains("dark"));
                lastLoggedRef.current = theme;
            }
        } catch (e) {
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    };

    const themeValue = useMemo(() => ({
        theme,
        toggleTheme
    }), [theme]);

    return (
        <ThemeContext.Provider value={themeValue}>
            {children}
        </ThemeContext.Provider>
    );
}