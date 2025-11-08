import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Benefits } from "../components/Benefits";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import React from "react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
