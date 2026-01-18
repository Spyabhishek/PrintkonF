import React, { useContext, useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import ProfileDropdown from "../profile/ProfileDropdown";
import companyInfo from "../../config/companyInfo";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, logout, loading, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="h-16 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left Side */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {companyInfo?.name || "Printkon"}
              </Link>
            </div>

            {/* Desktop Search Bar - Center */}
            <div className="flex-1 max-w-lg mx-8 hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Desktop Right Side Icons */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/user/wishlist"
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                aria-label="View wishlist"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>

              <Link
                to="/user/cart"
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                aria-label="View cart"
              >
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>

              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                    <div className="hidden xl:block text-left text-sm">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.roles || "Customer"}
                      </div>
                    </div>
                  </button>
                  <ProfileDropdown
                    isOpen={isDropdownOpen}
                    onClose={closeDropdown}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Side Icons */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <ThemeToggle />
              {/* Mobile Menu Button - Right Side */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden pb-4 animate-slideDown">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Slide-out Menu - FROM RIGHT */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            >
              {companyInfo?.name || "Printkon"}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Profile Section - Only if authenticated */}
          {isAuthenticated && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="w-12 h-12 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.name || "User"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.roles || "Customer"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <HomeIcon className="h-6 w-6" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                to="/products"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="font-medium">Products</span>
              </Link>

              <Link
                to="/user/wishlist"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                <span className="font-medium">Wishlist</span>
              </Link>

              <Link
                to="/user/cart"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="font-medium">Cart</span>
              </Link>

              {isAuthenticated && (
                <>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                  
                  <Link
                    to="/user/profile"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    to="/user/orders"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6" />
                    <span className="font-medium">My Orders</span>
                  </Link>

                  <Link
                    to="/user/settings"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Cog6ToothIcon className="h-6 w-6" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-blue-600 dark:border-blue-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Topbar;