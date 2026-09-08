import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Features from "@/components/Features";
import WhyChooseUs from "@/components/WhyChooseUs";
import Approach from "@/components/Approach";
import Gallery from "@/components/Gallery";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Introduction />
        <Features />
        <WhyChooseUs />
        <Approach />
        <Gallery />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
