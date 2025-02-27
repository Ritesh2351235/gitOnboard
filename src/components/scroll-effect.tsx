"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
              Contribute Faster & Smarter to <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Open-Source projects
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/assets/hero3.png`}
          alt="hero"
          height={1500}
          width={1200}
          className="mx-auto rounded-2xl h-full w-full  sm:h-[80vh] sm:w-auto md:h-auto md:w-full"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
