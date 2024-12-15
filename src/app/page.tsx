import { Hero, Features, Testimonials, Pricing } from '@/components/marketing/sections';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
    </main>
  );
}