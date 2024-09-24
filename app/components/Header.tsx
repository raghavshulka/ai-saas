import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const Header = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative flex min-h-screen flex-col justify-center items-center overflow-hidden bg-gray-950 px-4 py-12 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        <span className="mb-3 inline-block rounded-full bg-[#0d0d23] px-3 py-1.5 text-sm font-medium">
          Beta Now Live!
        </span>
        <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Transform Your Ideas into Stunning Visuals
        </h1>
        <p className="my-6 text-center text-lg leading-relaxed text-gray-300 max-w-2xl">
          Harness the power of AI to create unique, high-quality images in
          seconds. Perfect for designers, marketers, and creatives looking to
          bring their visions to life.
        </p>
        <motion.button
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="group relative flex items-center gap-2 rounded-full bg-gray-950/10 px-6 py-3 text-lg font-medium text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Start free trial
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-gray-950/50"></div>
    </motion.section>
  );
};
