"use client";

import { motion } from "framer-motion";

const PricingCards = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
        {/* Basic Plan */}
        <div className="w-full transform rounded-2xl border border-gray-300 bg-black p-8 shadow-xl transition-all duration-200 hover:scale-105 md:w-80">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="mb-4 text-2xl font-semibold text-white">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-white font-light">/month</span>
              </div>
              <ul className="mb-6 space-y-4">
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  100 API calls/day
                </li>
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  Basic support
                </li>
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  1 project
                </li>
              </ul>
            </div>
            <button className="w-full rounded-lg border border-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-800">
              Get Started
            </button>
          </div>
        </div>

        {/* Pro Plan - With Glowing Effect */}
        <motion.div
          className="relative w-full md:w-96 md:-mt-4 md:mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Glow effect wrapper */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/30 via-white/50 to-white/30"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              filter: "blur(8px)",
            }}
          />

          {/* Main card content */}
          <div className="relative rounded-2xl bg-black p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">Pro</h3>
                  <span className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs text-white">Popular</span>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$99</span>
                  <span className="text-white font-light">/month</span>
                </div>
                <ul className="mb-6 space-y-4">
                  <li className="flex items-center text-white font-light">
                    <span className="mr-2">✓</span>
                    Unlimited API calls
                  </li>
                  <li className="flex items-center text-white font-light">
                    <span className="mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center text-white font-light">
                    <span className="mr-2">✓</span>
                    5 projects
                  </li>
                  <li className="flex items-center text-white font-light">
                    <span className="mr-2">✓</span>
                    Advanced analytics
                  </li>
                </ul>
              </div>
              <motion.button
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-white transition-colors"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enterprise Plan */}
        <div className="w-full transform rounded-2xl border border-gray-300 bg-black p-8 shadow-xl transition-all duration-200 hover:scale-105 md:w-80">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="mb-4 text-2xl font-semibold text-white">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$299</span>
                <span className="text-white font-light">/month</span>
              </div>
              <ul className="mb-6 space-y-4">
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  Unlimited everything
                </li>
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  24/7 support
                </li>
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  Unlimited projects
                </li>
                <li className="flex items-center text-white font-light">
                  <span className="mr-2">✓</span>
                  Custom solutions
                </li>
              </ul>
            </div>
            <button className="w-full rounded-lg border border-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-800">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;