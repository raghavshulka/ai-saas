'use client'
import { useState } from "react";
import { motion } from "framer-motion";

// Custom Button component


// Custom Card component
const CustomCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="rounded-lg overflow-hidden bg-gray-800 shadow-lg"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const sampleImages = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
];

export default function Generate1() {
  const [generatedImage ] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
  );

  return (
    <div className="min-h-screen text-white p-4 md:p-8 lg:p-12">
      <header className="mb-8 flex flex-col w-full justify-center items-center text-center">
        <h1 className="text-3xl font-bold">
          <span className="text-purple-500">Generate AI Photos</span>
        </h1>
        <p className="text-xl mt-2">
          Upload your selfies and start taking AI photos now
        </p>
      </header>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-xs md:max-w-md lg:max-w-lg">
          {sampleImages.map((src, index) => (
            <CustomCard key={index}>
              <img
                src={src}
                alt={`Sample ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </CustomCard>
          ))}
        </div>

        {/* Arrow Icon */}
        <div className="hidden lg:flex items-center">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>

        {/* AI Generated Image */}
        <div className="w-full md:max-w-sm lg:max-w-[300px]">
          <CustomCard>
            <img
              src={generatedImage}
              alt="AI Generated Photo"
              className="w-full h-auto"
            />
          </CustomCard>
        </div>
      </div>
    </div>
  );
}