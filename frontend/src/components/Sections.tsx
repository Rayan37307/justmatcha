const Sections = () => {
  return (
    <div className="flex flex-col gap-24 mt-20 mb-20">
      {/* Section 1 */}
      <div className="max-w-[95rem] mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/diff.jpeg"
            alt="Matcha Difference"
            className="w-full object-cover rounded-sm max-h-[700px] "
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-green-900 mb-4">
            The Matcha Difference
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed">
            Matcha isn’t just tea – it’s a full-leaf superfood. By consuming the
            whole leaf, you get more nutrients, more antioxidants, and
            longer-lasting energy than coffee or regular green tea.
          </p>
          <button className="bg-green-900 hover:bg-green-800 text-white px-10 py-4 rounded-lg mt-6 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Section 2 */}
      <div className="max-w-[95rem] mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/2big.jpeg"
            alt="Healthy Coffee Alternative"
            className="w-full object-cover rounded-sm max-h-[700px] "
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-green-900 mb-4">
            Healthy Coffee Alternative
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed">
            All the energy, none of the jitters. Matcha provides a calm, focused
            boost thanks to its unique balance of caffeine and L-theanine –
            making it the smarter way to power through your day.
          </p>
          <button className="bg-green-900 hover:bg-green-800 text-white px-10 py-4 rounded-lg mt-6 transition-colors">
            FAQ
          </button>
        </div>
      </div>

      {/* Section 3 */}
      <div className="max-w-[95rem] mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/3big.jpeg"
            alt="Our Promise"
            className="w-full max-h-[700px] object-cover rounded-sm"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-green-900 mb-4">
            Our Promise
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed">
            Grown in Japan. Certified Organic. We source AAA-grade matcha
            directly from sustainable Japanese farms. No additives, no
            compromise – just pure, vibrant green goodness.
          </p>
          <button className="bg-green-900 hover:bg-green-800 text-white px-10 py-4 rounded-lg mt-6 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sections;
