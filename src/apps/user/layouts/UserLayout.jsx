import React from "react";
import { Outlet } from "react-router-dom";

export default function UserLayout({ children }) {

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}