import React from "react";
import heroImage from "../assets/hero.png";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Side: Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-5xl md:text-7xl font-bold text-green-900 leading-tight mb-4">
            Calm Energy
            <br />
            in Every Sip 🍵
          </h1>
          <p className="text-lg text-gray-600 my-8">
            Fuel your day with organic Japanese matcha – smooth, steady energy
            without the crash.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
            <Link
              to="/products"
              className="bg-green-800 text-white font-bold 
               text-sm sm:text-base md:text-lg lg:text-xl 
               px-4 sm:px-6 md:px-8 lg:px-10 
               py-2 sm:py-3 md:py-4 lg:py-5 
               rounded-lg hover:bg-green-900 
               transition duration-300 shadow-lg"
            >
              Shop Now
            </Link>

            <Link
              to="/about"
              className="bg-transparent text-green-800 font-bold 
               text-sm sm:text-base md:text-lg lg:text-xl 
               px-4 sm:px-6 md:px-8 lg:px-10 
               py-2 sm:py-3 md:py-4 lg:py-5 
               rounded-lg border-2 border-green-800 
               hover:bg-green-800 hover:text-white 
               transition duration-300"
            >
              Learn More
            </Link>
          </div>

        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2 relative mt-10 md:mt-0">
          <div className="relative mx-auto max-w-[500px]">
            {/* Main container with stroke outline */}
            <div className="relative rounded-[2rem] border border-black p-2">
              <img
                src={heroImage}
                alt="Matcha powder in a bowl"
                className="rounded-[2rem] shadow-2xl"
              />

              {/* Floating Tag - Top Right */}
              <div className="absolute top-12 -right-12 bg-[#c1f0d1] text-gray-800 text-base px-6 py-3 rounded-full shadow-lg">
                Award winning product
              </div>

              {/* Floating Tag - Bottom Left */}
              <div className="absolute bottom-12 -left-12 bg-[#c1f0d1] text-gray-800 text-base px-6 py-3 rounded-full shadow-lg">
                Ergonomic design
              </div>
            </div>

            {/* Decorative STAR (top-left) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-6 -left-6 w-12 h-12 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L13.5 9L21 12L13.5 15L12 22L10.5 15L3 12L10.5 9L12 2Z" />
            </svg>

            {/* Decorative rounded stroke corner (bottom-right) */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border border-black rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
