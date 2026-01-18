import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { useCategories } from '../../../shared/hooks/useCategories';

const Navigation = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [maxVisible, setMaxVisible] = useState(0);
    const navigate = useNavigate();

    const navRef = useRef(null);
    const dropdownRef = useRef(null);

    const { data: categories = [], isLoading, isError } = useCategories();

    // Memoize the split categories based on maxVisible count
    const { visibleCategories, hiddenCategories } = useMemo(() => {
        return {
            visibleCategories: categories.slice(0, maxVisible),
            hiddenCategories: categories.slice(maxVisible)
        };
    }, [categories, maxVisible]);

    // Handle category navigation consistently
    const handleCategoryClick = (category) => {
        const searchParams = new URLSearchParams();
        if (category.categoryId) {
            searchParams.append('categoryId', category.categoryId);
        } else if (category.id) {
            searchParams.append('categoryId', category.id);
        }

        if (category.name) {
            searchParams.append('category', category.name);
        }


        navigate(`/products?${searchParams.toString()}`);
        setIsDropdownOpen(false);
    };

    // Calculate visible categories count on mount and when categories length changes
    useEffect(() => {
        if (!navRef.current || categories.length === 0 || isLoading) {
            setMaxVisible(0);
            return;
        }

        const container = navRef.current;
        const containerWidth = container.offsetWidth;
        const reservedSpace = 270;
        const availableWidth = containerWidth - reservedSpace;
        const estimatedCategoryWidth = 120;

        const calculated = Math.max(0, Math.min(
            Math.floor(availableWidth / estimatedCategoryWidth),
            categories.length
        ));

        setMaxVisible(calculated);
    }, [categories.length, isLoading]);

    // Handle resize with debouncing
    useEffect(() => {
        let resizeTimer;

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!navRef.current || categories.length === 0 || isLoading) return;

                const container = navRef.current;
                const containerWidth = container.offsetWidth;
                const reservedSpace = 270;
                const availableWidth = containerWidth - reservedSpace;
                const estimatedCategoryWidth = 120;

                const calculated = Math.max(0, Math.min(
                    Math.floor(availableWidth / estimatedCategoryWidth),
                    categories.length
                ));

                setMaxVisible(calculated);
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, [categories.length, isLoading]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isError) {
        return (
            <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-6 h-12">
                        <Link
                            to="/products"
                            className="flex items-center space-x-2 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Grid3X3 className="h-4 w-4" />
                            <span>All Products</span>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={navRef} className="flex items-center space-x-6 h-12">
                    <Link
                        to="/products"
                        className="flex items-center space-x-2 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <Grid3X3 className="h-4 w-4" />
                        <span>All Products</span>
                    </Link>

                    {!isLoading &&
                        visibleCategories.map((category) => (
                            <button
                                key={category.id || category.categoryId}
                                onClick={() => handleCategoryClick(category)}
                                className="whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                {category.name}
                            </button>
                        ))}

                    {!isLoading && hiddenCategories.length > 0 && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-1 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <span>More Categories</span>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full ml-1">
                                    +{hiddenCategories.length}
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                                    <div className="py-2 max-h-80 overflow-y-auto">
                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-600">
                                            Additional Categories
                                        </div>
                                        {hiddenCategories.map((category) => (
                                            <button
                                                key={category.id || category.categoryId}
                                                onClick={() => handleCategoryClick(category)}
                                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{category.name}</span>
                                                </div>
                                                {category.description && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                        {category.description}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex space-x-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;