import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-background text-foreground selection:bg-brand/35 selection:text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Hero />
          <Features />
          <SocialProof />
          <HowItWorks />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
