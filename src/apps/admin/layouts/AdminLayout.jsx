import React from "react";
import Sidebar from "../../../shared/components/layout/Sidebar";
import Topbar from "../../../shared/components/layout/Topbar";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar onLogout={logout} user={user} />
                <main className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">{children}</main>
            </div>
        </div>
    );
}
