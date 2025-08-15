import React from 'react';
import heroImage from '../assets/hero.png';
import { Link } from 'react-router-dom';

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
          <div className="flex justify-center md:justify-start space-x-4">
            <Link to="/products" className="bg-green-800 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-900 transition duration-300 shadow-lg">
              Shop Now
            </Link>
            <Link to="/about" className="bg-transparent text-green-800 font-bold py-4 px-8 rounded-lg border-2 border-green-800 hover:bg-green-800 hover:text-white transition duration-300">
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2 relative mt-10 md:mt-0">
          <div className="relative mx-auto" style={{ maxWidth: '500px' }}>
            <img
              src={heroImage}
              alt="Matcha powder in a bowl"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute top-12 -right-12 bg-[#c1f0d1] text-gray-800 text-base px-6 py-3 rounded-full shadow-lg transform -rotate-6">
              Award winning product
            </div>
            <div className="absolute bottom-12 -left-12 bg-[#c1f0d1] text-gray-800 text-base px-6 py-3 rounded-full shadow-lg transform rotate-6">
              Ergonomic design
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
