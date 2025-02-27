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
            <h1 className="text-4xl font-semibold text-white ">
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
          height={1000}
          width={2200}
          className="mx-auto rounded-2xl h-auto w-full object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
