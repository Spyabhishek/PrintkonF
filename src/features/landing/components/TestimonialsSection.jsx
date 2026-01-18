import { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { useTestimonials } from '../../../shared/hooks/useTestimonials';

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading, isError } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getTransformStyle = () => {
    if (testimonials.length <= 3) return { transform: 'translateX(0)' };

    const itemWidth = 100 / 3; // Each item takes 33.33% of container
    const translateX = -currentIndex * itemWidth;

    return {
      transform: `translateX(${translateX}%)`,
      transition: 'transform 0.5s ease-in-out'
    };
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !testimonials.length) {
    return null;
  }

  // For infinite scroll effect, duplicate testimonials
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          What Our Customers Say
        </h2>

        <div className="relative overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-6"
            style={getTransformStyle()}
          >
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 h-full">
                  <Quote className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />

                  <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-4 line-clamp-3">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div className="text-sm min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {testimonial.author}
                      </div>
                      {testimonial.role && (
                        <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                          {testimonial.role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"></div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex % testimonials.length
                    ? 'bg-blue-600 dark:bg-blue-400 w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;