import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

const nav = [
  { to: "/user/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/user/orders", label: "My Orders", icon: ClipboardDocumentListIcon },
  { to: "/products", label: "Browse Products", icon: ShoppingCartIcon },
];

const userSettingsNav = [
  { to: "/user/profile", label: "Profile", icon: UserCircleIcon },
  { to: "/user/settings", label: "Settings", icon: Cog6ToothIcon },
  { to: "/user/upgrade-role", label: "Upgrade Role", icon: ArrowUpOnSquareIcon },
];

export default function ProfileDropdown({ isOpen, onClose, onLogout, isLoggingOut }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4 transition-all duration-200 origin-top-right transform scale-100 opacity-100"
    >
      <nav className="flex flex-col gap-1 mb-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Account</h3>
        <nav className="flex flex-col gap-1">
          {userSettingsNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors
              ${isLoggingOut
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
              }`}
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </div>
    </div>
  );
}