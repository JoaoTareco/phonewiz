import { Container } from "@/components/Container";
import  Hero from "@/components/landing/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import  Video  from "@/components/landing/Video";
import { Testimonials } from "@/components/Testimonials";
// import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";
import About from "@/components/landing/About";
import NavigationMenuLanding from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import  Footer  from "@/components/landing/Footer";

const LandingPage = () => {
  return (

    <main>
      <NavigationMenuLanding />
      <Hero />

      <Footer />
    </main>

  );
}
export default LandingPage;
