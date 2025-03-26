// app/page.tsx
import HeroSection from '../components/HeroSection';
import DestinationCards from '../components/DestinationCards';
import FeatureCards from '../components/FeatureCards';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProfilePage from './profile/page';
import InteractiveMap from '../components/InteractiveMap';
import BookingSystem from '@/components/BookingSystem';
import BlogSection from '@/components/BlogSection';
import Reviews from '@/components/Reviews';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureCards />
        <DestinationCards />
        <BookingSystem />
        <BlogSection />
        <Reviews />
        <Testimonials />
        <Gallery />
        <InteractiveMap />
        <ProfilePage />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
