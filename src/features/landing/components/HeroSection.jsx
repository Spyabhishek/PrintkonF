import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import companyInfo from "../../../shared/config/companyInfo";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Premium Business Cards",
            subtitle: "Make lasting impressions with high-quality, custom business cards",
            image: "https://images.unsplash.com/photo-1541623089466-8e777dd05d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            bgGradient: "from-blue-600 to-purple-700",
            ctaText: "Design Business Cards"
        },
        {
            id: 2,
            title: "Elegant Wedding Cards",
            subtitle: "Beautiful invitations that celebrate your special day perfectly",
            image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            bgGradient: "from-pink-600 to-rose-700",
            ctaText: "Create Invitations"
        },
        {
            id: 3,
            title: "Professional Bill Books",
            subtitle: "Streamline your business with custom invoice and receipt books",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            bgGradient: "from-green-600 to-emerald-700",
            ctaText: "Order Bill Books"
        },
        {
            id: 4,
            title: "Complete Stationery Suite",
            subtitle: "From letterheads to envelopes - unified branding for your business",
            image: "https://images.unsplash.com/photo-1586220742613-b731f66f7743?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            bgGradient: "from-orange-600 to-red-700",
            ctaText: "View Stationery"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className={`relative bg-gradient-to-r ${slides[currentSlide].bgGradient} dark:from-blue-900 dark:to-purple-900 text-white overflow-hidden`}>
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute top-32 right-16 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute bottom-16 left-1/4 w-10 h-10 bg-white rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Content Section */}
                    <div className="relative z-10">
                        <div className="overflow-hidden h-48">
                            {slides.map((slide, index) => (
                                <div 
                                    key={slide.id}
                                    className={`transition-all duration-500 ${
                                        index === currentSlide 
                                            ? 'opacity-100 transform translate-y-0' 
                                            : 'opacity-0 transform translate-y-4 absolute top-0'
                                    }`}
                                >
                                    <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-snug">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg mb-6 text-white/90">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                        <Link
                                            to="/products"
                                            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-center hover:scale-105 shadow-lg"
                                        >
                                            {slide.ctaText}
                                        </Link>
                                        <Link
                                            to="/products"
                                            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
                                        >
                                            View Products
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Compact Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold">5000+</div>
                                <div className="text-white/80 text-xs">Happy Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold">24/7</div>
                                <div className="text-white/80 text-xs">Support</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold">Fast</div>
                                <div className="text-white/80 text-xs">Delivery</div>
                            </div>
                        </div>
                    </div>

                    {/* Image Slider */}
                    <div className="relative">
                        <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
                            {slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Floating Elements */}
            <div className="absolute bottom-6 left-6 hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-2 border border-white/20">
                    <div className="text-xs font-medium">Free Delivery</div>
                    <div className="text-xs text-white/70">Orders above ₹999</div>
                </div>
            </div>

            <div className="absolute top-6 right-6 hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-2 border border-white/20">
                    <div className="text-xs font-medium">24-48 Hours</div>
                    <div className="text-xs text-white/70">Express Printing</div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;