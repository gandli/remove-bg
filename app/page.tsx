"use client";

import Image from "next/image";
import { ImgComparisonSlider } from "@img-comparison-slider/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          img-comparison-slider
        </h1>
        <ImgComparisonSlider
          className="w-full h-auto focus:outline-none"
          hover={true}
        >
          <Image
            slot="first"
            alt="清晰的紫色花朵"
            width={1280}
            height={550}
            src="/images/purple-flowers.3308ebc4.webp"
            priority
            className="w-full h-auto object-cover"
          />
          <Image
            slot="second"
            alt="模糊的紫色花朵"
            width={1280}
            height={550}
            src="/images/purple-flowers-blurred.aa6014e2.webp"
            className="w-full h-auto object-cover"
          />
        </ImgComparisonSlider>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Swipe left and right to compare sharp and blurry images
        </p>
      </main>
    </div>
  );
}
