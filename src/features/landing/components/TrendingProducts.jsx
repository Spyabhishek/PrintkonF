import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import Card from "../../../shared/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTrendingProducts } from "../../../shared/hooks/useTrendingProducts";

const TrendingProducts = () => {
    const scrollRef = useRef(null);
    const { data: response = {}, isLoading, isError } = useTrendingProducts(8);

    // Extract products from the response data
    const products = response?.data || [];

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
            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                        Trending Products
                    </h2>
                    <div className="flex overflow-x-auto gap-6 scrollbar-hide px-10">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex-shrink-0 w-60">
                                <Card className="rounded-2xl overflow-hidden">
                                    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    <div className="p-4">
                                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
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

    // Don't render if error or no products
    if (isError || !products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-white dark:bg-gray-900 relative">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                    Trending Products
                </h2>

                <div className="relative">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 shadow-md p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </button>

                    {/* Scrollable container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth px-10 py-2"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.productId}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 w-60"
                            >
                                <Link to={`/products/${product.productId}`}>
                                    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                        <img
                                            src={product.mainImageUrl || product.imageUrl || "https://via.placeholder.com/300"}
                                            alt={product.name}
                                            className="w-full h-40 object-cover"
                                            loading="lazy"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="font-semibold text-blue-600 dark:text-blue-400">
                                                    ₹{product.price}
                                                </p>
                                                {/* Rating display */}
                                                {product.averageRating > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {product.averageRating?.toFixed(1)}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            ({product.reviewCount || product.stats?.reviewCount || 0})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 shadow-md p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;