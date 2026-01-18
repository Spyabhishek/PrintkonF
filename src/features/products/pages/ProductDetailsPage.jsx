import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../../shared/hooks/useProducts";
import { ArrowLeft, Heart, ShoppingCart, Zap, Copy, Star, Eye } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToastContext } from "../../../shared/context/ToastContext";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [localLoading, setLocalLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    
    const { showSuccess, showError, showInfo } = useToastContext();

    const {
        data: response,
        isLoading,
        error,
        isError,
        isFetching
    } = useProduct(productId);

    // Extract product from response.data
    const product = response?.data;

    // Enhanced debug logging
    useEffect(() => {
        console.log('🔍 PRODUCT DATA DEBUG:', {
            productId,
            isLoading,
            isError,
            isFetching,
            response: response,
            product: product,
            productKeys: product ? Object.keys(product) : 'no product',
            error: error
        });
        
        if (product) {
            console.log('📦 PRODUCT DETAILS:', {
                name: product.name,
                price: product.price,
                available: product.available,
                inStock: product.inStock,
                description: product.description,
                mainImageUrl: product.mainImageUrl,
                imageUrls: product.imageUrls,
                categoryName: product.categoryName,
                productId: product.productId,
                stats: product.stats,
                // Specifically log rating data
                averageRating: product.stats?.averageRating,
                reviewCount: product.stats?.reviewCount
            });
        }
    }, [product, isLoading, isError, isFetching, productId, error, response]);

    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImage(0);
    }, [product?.productId]);

    // Safe image data with fallbacks
    const imageData = useMemo(() => {
        if (!product) {
            return { mainImage: null, allImages: [] };
        }
        
        const mainImg = product.mainImageUrl || product.imageUrls?.[0] || null;
        
        let images = [];
        if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
            images = [...product.imageUrls];
        } else if (mainImg) {
            images = [mainImg];
        }
        
        images = [...new Set(images.filter(img => img != null))];
        
        return { mainImage: mainImg, allImages: images };
    }, [product]);

    const { mainImage, allImages } = imageData;

    // ✅ FIXED: Correct data access for stats that are nested under stats object
    const productName = product?.name || 'Unnamed Product';
    const productDescription = product?.description || '';
    const productPrice = product?.price || 0;
    const originalPrice = product?.originalPrice || null;
    const categoryName = product?.categoryName || 'Uncategorized';
    
    // ✅ CORRECT: Access rating data from stats object
    const averageRating = product?.stats?.averageRating || 0;
    const reviewCount = product?.stats?.reviewCount || 0;
    
    // ✅ CORRECT: Use available property from root level
    const isInStock = product?.available ?? true;
    
    // ✅ CORRECT: Access other stats from stats object
    const viewsCount = product?.stats?.viewsCount || 0;
    const salesCount = product?.stats?.salesCount || 0;
    const wishlistCount = product?.stats?.wishlistCount || 0;
    
    // Stock quantity is at root level
    const stockQuantity = product?.stockQuantity || 0;

    const copyProductId = useCallback(async () => {
        if (!productId) return;

        try {
            await navigator.clipboard.writeText(productId);
            setCopied(true);
            showInfo("Product ID copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy product ID:', err);
            showError("Failed to copy");
        }
    }, [productId, showInfo, showError]);

    const handleBuyNow = useCallback(async () => {
        if (!productId) return;

        try {
            setLocalLoading(true);
            showInfo("Proceeding to checkout...");
            navigate("/user/checkout");
        } catch (err) {
            console.error("❌ Could not proceed to checkout:", err);
            showError("Failed to proceed to checkout");
        } finally {
            setLocalLoading(false);
        }
    }, [productId, showInfo, showError, navigate]);

    const handleImageError = useCallback((e) => {
        console.log('🖼️ Image failed to load:', e.target.src);
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) {
            fallback.style.display = 'flex';
        }
    }, []);

    const handleThumbnailError = useCallback((e) => {
        console.log('🖼️ Thumbnail failed to load:', e.target.src);
        const parent = e.target.parentElement;
        if (parent) {
            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-200 dark:bg-gray-700">Image Error</div>';
        }
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !product) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Product Not Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {error?.message || "The product you're looking for doesn't exist or may have been removed."}
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse All Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    console.log('✅ Rendering product with data:', { 
        productName, 
        productPrice, 
        isInStock,
        averageRating,
        reviewCount,
        product 
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Products</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                        {allImages.length > 0 ? (
                            <>
                                <img
                                    src={allImages[selectedImage]}
                                    alt={productName}
                                    className="w-full h-96 object-cover"
                                    onError={handleImageError}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ display: 'none' }}>
                                    No Image Available
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">📄</div>
                                    <p className="text-sm">No Image Available</p>
                                    <p className="text-xs text-gray-400 mt-1">Booklet Product</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                                        selectedImage === index 
                                            ? 'border-blue-500 ring-2 ring-blue-200' 
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${productName} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={handleThumbnailError}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {productName}
                        </h1>

                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {categoryName}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                ID: {product.productId}
                            </span>
                            <button
                                onClick={copyProductId}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Copy Product ID"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            {copied && (
                                <span className="text-xs text-green-600 font-medium animate-pulse">Copied!</span>
                            )}
                        </div>
                    </div>

                    {/* Rating and Stats - NOW SHOULD SHOW CORRECT DATA */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                        {/* Rating - fixed to use stats.averageRating */}
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{averageRating.toFixed(1)}</span>
                            <span>({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                        </div>

                        {/* Views - fixed to use stats.viewsCount */}
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{viewsCount.toLocaleString()} views</span>
                        </div>

                        {/* Sales - fixed to use stats.salesCount */}
                        {salesCount > 0 && (
                            <div className="flex items-center gap-1">
                                <span>🔥</span>
                                <span>{salesCount} sold</span>
                            </div>
                        )}

                        {/* Wishlist - fixed to use stats.wishlistCount */}
                        {wishlistCount > 0 && (
                            <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span>{wishlistCount} wishlisted</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            ₹{productPrice.toLocaleString()}
                        </span>
                        {originalPrice && originalPrice > productPrice && (
                            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {productDescription && (
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {productDescription}
                            </p>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isInStock 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                        {isInStock ? `In Stock (${stockQuantity} available)` : 'Out of Stock'}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleBuyNow}
                            disabled={localLoading || !isInStock}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-medium"
                        >
                            <Zap className="w-5 h-5" />
                            {localLoading ? 'Processing...' : 'Buy Now'}
                        </button>
                        
                        <button
                            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Heart className="w-5 h-5" />
                            Wishlist
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Availability</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isInStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Category</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {categoryName}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Stock Quantity</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stockQuantity} units
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Rating</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {averageRating.toFixed(1)} stars ({reviewCount} reviews)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;