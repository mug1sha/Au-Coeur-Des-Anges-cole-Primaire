import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Highlights from "@/components/highlights";
import SchoolIntro from "@/components/school-intro";
import Programs from "@/components/programs";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#463ACB] overflow-x-hidden">
      <Navbar />

      <Hero />

      <Highlights />

      <SchoolIntro />

      <Programs />

      <Testimonials />

      <CTA />

      <Footer />
    </main>
  );
}
