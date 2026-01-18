import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  XMarkIcon // New icon for closing
} from "@heroicons/react/24/outline";

const nav = [
  { to: "/user/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/user/orders", label: "My Orders", icon: ClipboardDocumentListIcon },
  { to: "/products", label: "Browse Products", icon: ShoppingCartIcon },
];

const userSettingsNav = [
  { to: "/user/profile", label: "Profile", icon: UserCircleIcon },
  { to: "/user/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for outside click */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-out Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Printer's</span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose} // Close sidebar on nav click
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Settings */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Account</h3>
          <nav className="flex flex-col gap-1">
            {userSettingsNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose} // Close sidebar on nav click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}