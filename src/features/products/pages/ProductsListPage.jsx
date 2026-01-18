import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../../shared/hooks/useProducts';
import { useCategories } from '../../../shared/hooks/useCategories';
import Loading from '../../../shared/components/ui/Loading';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';

const ProductsListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        categoryId: searchParams.get('categoryId') || '',
        page: parseInt(searchParams.get('page') || '0'),
        size: parseInt(searchParams.get('size') || '20'),
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortDirection: searchParams.get('sortDirection') || 'DESC',
    });
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading, error } = useProducts(filters);
    const { data: categoriesData } = useCategories();

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.categoryId) params.set('categoryId', filters.categoryId);
        if (filters.page > 0) params.set('page', filters.page.toString());
        if (filters.size !== 20) params.set('size', filters.size.toString());
        if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
        if (filters.sortDirection !== 'DESC') params.set('sortDirection', filters.sortDirection);
        if (searchQuery) params.set('search', searchQuery);
        setSearchParams(params, { replace: true });
    }, [filters, searchQuery, setSearchParams]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 0 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setFilters(prev => ({ ...prev, page: 0 }));
        }
    };

    const clearFilters = () => {
        setFilters({
            categoryId: '',
            page: 0,
            size: 20,
            sortBy: 'createdAt',
            sortDirection: 'DESC',
        });
        setSearchQuery('');
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const hasActiveFilters = filters.categoryId || searchQuery;

    const products = data?.data?.content || [];
    const pageInfo = {
        pageNumber: data?.data?.pageNumber || 0,
        pageSize: data?.data?.pageSize || 20,
        totalElements: data?.data?.totalElements || 0,
        totalPages: data?.data?.totalPages || 0,
    };

    const selectedCategory = categoriesData?.data?.find(
        cat => cat.categoryId === filters.categoryId
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4">
                        {/* Title and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Go back"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="hidden sm:inline">Back</span>
                                </button>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {selectedCategory ? selectedCategory.name : 'All Products'}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {pageInfo.totalElements} products found
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </button>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Search
                            </button>
                        </form>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                        {selectedCategory.name}
                                        <button
                                            onClick={() => handleFilterChange({ categoryId: '' })}
                                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                        Search: "{searchQuery}"
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside
                        className={`${showFilters ? 'block' : 'hidden'
                            } lg:block w-full lg:w-64 flex-shrink-0`}
                    >
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categoriesData?.data || []}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loading size="lg" />
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                                <p className="text-red-800 dark:text-red-200">
                                    Failed to load products. Please try again.
                                </p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Search className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Try adjusting your search or filters to find what you're looking for.
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.productId} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pageInfo.totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={pageInfo.pageNumber}
                                            totalPages={pageInfo.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsListPage;