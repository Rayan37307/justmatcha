import React from 'react';

const Why = () => {
  const WhyData = [
    { name: "Energy", icon: "/energy.png" },
    { name: "Focus", icon: "/focus.png" },
    { name: "Clarity", icon: "/clarity.png" },
    { name: "Antioxidants", icon: "/antioxidants.png" }
  ];

  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <h3 className="text-[36px] sm:text-[48px] font-bold text-green-900 text-center mb-10">
        Why JustMatcha?
      </h3>

      <div className="bg-[#AADA91] text-black rounded-xl w-full max-w-6xl mx-auto p-6 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {WhyData.map((data, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src={data.icon}
                alt={data.name}
                className="w-30 h-30 mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold">{data.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Why;
