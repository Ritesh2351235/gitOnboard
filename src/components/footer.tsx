"use client";

import Link from "next/link";
import { Laptop } from "lucide-react";
import { TextHoverEffect } from "./ui/text-hover-effect";

export function Footer() {
  return (
    <>
      <footer className="border-t border-y-gray-400 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
              <div>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/pricing"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                    >
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="https://twitter.com"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://linkedin.com"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com"
                      className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center justify-center md:justify-start">
              <span className="ml-2 text-xl font-bold text-white">gitOnboard</span>
            </div>
            <p className="mt-2 text-center text-xs font-normal leading-5 text-gray-400 md:text-left">
              Copyright © 2025 gitOnboard
            </p>
            <p className="text-center text-xs font-normal leading-5 text-gray-400 md:text-left">
              All rights reserved
            </p>
          </div>
        </div>
      </footer>
      <div className="flex h-[20rem] items-start justify-start mt-2 ">
        <TextHoverEffect text="gitOnboard" />
      </div>
    </>
  );
}