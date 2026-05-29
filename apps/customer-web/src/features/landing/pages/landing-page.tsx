import { useEffect } from 'react';
import { LandingHeader } from '../components/landing-header';
import { HeroSection } from '../components/hero';
import { HowItWorks } from '../components/how-it-works';
import { BenefitsSection } from '../components/benefits';
import { TestimonialsSection } from '../components/testimonials';
import { CTASection } from '../components/cta-section';
import { LandingFooter } from '../components/landing-footer';

export function LandingPage() {
  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
