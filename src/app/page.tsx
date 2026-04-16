import ChatButton from '@/src/components/ChatButton';
import CTA from '@/src/components/CTA';
import FAQ from '@/src/components/FAQ';
import Footer from '@/src/components/Footer';
import Hero from '@/src/components/Hero';
import HowItWorks from '@/src/components/HowItWorks';
import NavHome from '@/src/components/NavHome';
import Services from '@/src/components/Services';
import WhyDola from '@/src/components/WhyDola';

const page = () => {
  return (
    <main className="min-h-screen bg-white font-sans antialiased selection:bg-primary/20">
      
      {/* <CountdownModal /> */}
      <ChatButton /> {/* Added Chat Button here */}

      <NavHome />
      <Hero />
      <Services />
      <HowItWorks />
      <WhyDola />
      <FAQ /> {/* Added FAQ Section */}
      <CTA />
      <Footer />
    </main>
  );
}

export default page