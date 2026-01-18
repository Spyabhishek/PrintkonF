// features/landing/components/ExploreAllCategories.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import Card from "../../../shared/components/ui/Card";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useCategories } from "../../../shared/hooks/useCategories";

const ExploreAllCategories = () => {
    const scrollRef = useRef(null);
    const { data: categories = [], isLoading, isError } = useCategories();

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Show loading skeleton
    if (isLoading) {
        return (
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Browse Categories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover products across all our carefully curated categories
                        </p>
                    </div>
                    <div className="flex overflow-x-auto gap-6 scrollbar-hide px-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="flex-shrink-0 w-64">
                                <Card className="rounded-xl h-full flex flex-col overflow-hidden border-0 shadow-lg">
                                    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    <div className="p-6 flex flex-col items-center text-center">
                                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if error or no categories
    if (isError || !categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white dark:bg-gray-900 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Browse Categories
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover products across all our carefully curated categories
                    </p>
                </div>

                <div className="relative">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>

                    {/* Categories List */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 scrollbar-hide scroll-smooth px-2 py-4"
                    >
                        {categories.map((category) => (
                            <motion.div
                                key={category.categoryId}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 w-64"
                            >
                                <Link
                                    to={`/products?categoryId=${category.categoryId}&category=${encodeURIComponent(category.name)}`}
                                    className="block"
                                >
                                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl h-full flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                                        {/* Thumbnail Image */}
                                        <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                                            {category.thumbnailUrl ? (
                                                <img
                                                    src={category.thumbnailUrl}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-full h-full flex items-center justify-center ${category.thumbnailUrl ? 'hidden' : 'flex'}`}
                                            >
                                                <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                            </div>

                                            {/* Product Count Badge */}
                                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {category.productCount || 0} products
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col items-center text-center flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                                {category.name}
                                            </h3>

                                            {category.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                                                    {category.description}
                                                </p>
                                            )}

                                            {/* Category Stats */}
                                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                {category.active !== false && (
                                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                                        Active
                                                    </span>
                                                )}

                                                {/* Display Order (for admin context) */}
                                                {category.displayOrder > 0 && (
                                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                                        #{category.displayOrder}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Sub-categories indicator */}
                                            {category.subCategories && category.subCategories.length > 0 && (
                                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                                    +{category.subCategories.length} sub-categories
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>
                </div>

                {/* View All Categories Link */}
                <div className="text-center mt-12">
                    <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        View All Categories
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ExploreAllCategories;