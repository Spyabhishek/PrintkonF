import {
  Topbar,
  Navigation,
  HeroSection,
  ExploreAllCategories,
  TrendingProducts,
  PopularProducts,
  PrintingServices,
  TestimonialsSection,
  StatsSection,
  FeaturesSection,
  Footer,
} from '../../../features/landing/components';
import useScrollToTop from '../../../shared/hooks/useScrollToTop';

const UserLandingPage = () => {

  // useScrollToTop();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Topbar />
      <Navigation />
      <HeroSection />
      <StatsSection />

      <section id="categories">
        <ExploreAllCategories />
      </section>

      <section id="trending-products">
        <TrendingProducts />
      </section>

      <section id="popular-products">
        <PopularProducts />
      </section>

      <section id="printing-services">
        <PrintingServices />
      </section>

      <section id="our-features">
        <FeaturesSection />
      </section>
      
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default UserLandingPage;