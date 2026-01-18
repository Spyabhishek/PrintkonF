import React from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./shared/components/common/ErrorBoundary";
import { ThemeProvider } from "./shared/context/ThemeContext";
import { AuthProvider } from "./shared/context/AuthContext";
import { ToastProvider } from "./shared/context/ToastContext";
import AppRoutes from "./shared/routes/AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}