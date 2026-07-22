import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CommunityMap from "../components/home/CommunityMap";
import CommunityFeed from "../components/home/CommunityFeed";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features/>
      <CommunityMap/>
      <CommunityFeed/>
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}