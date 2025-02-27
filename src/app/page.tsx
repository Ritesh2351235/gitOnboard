'use client';

import { Footer } from "@/components/footer";
import { GlowingEffectDemoSecond } from "@/components/grid-glow";
import PricingCards from "@/components/pricingcards";
import { HeroScrollDemo } from "@/components/scroll-effect";


const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full flex-row items-center justify-between bg-transparent px-6 py-4 backdrop-blur-xl transition-all">
      <div className="flex items-center">
        <a href="/" className="text-xl font-bold text-white hover:text-gray-200">
          gitOnboard
        </a>
        <div className="ml-8 hidden space-x-4 md:flex">
          <a href="/features" className="text-sm text-white hover:text-gray-200">
            Features
          </a>
          <a href="/docs" className="text-sm text-white hover:text-gray-200">
            Docs
          </a>
          <a href="/blog" className="text-sm text-white hover:text-gray-200">
            Blog
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/sign-in" className="text-sm text-white hover:text-gray-200">
          Login
        </a>
        <a
          href="/sign-up"
          className="rounded-lg bg-white px-4 py-2 text-sm text-black hover:bg-gray-200"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="relative pt-16">
        <HeroScrollDemo />

        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white md:text-6xl">
            Everything you need to contribute
          </h2>
          <p className="text-lg font-light leading-relaxed text-white md:text-xl">
            gitOnboard makes open-source contribution effortless with AI-powered LLMs for your projects from discovering repos to resolving doubts.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <GlowingEffectDemoSecond />
        </div>


        <div className="mb-24"></div>

        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="mb-6 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Simple pricing for your ease
          </h2>
          <p className="text-lg font-light leading-relaxed text-white md:text-xl mb-6">
            gitOnboard provides powerful tools for open-source contribution—choose a plan and start instantly
          </p>
        </div>

        <PricingCards />


        <div className="mb-40"></div>

        <Footer />
      </main>
    </div>
  );
}