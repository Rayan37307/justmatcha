
const About = () => {
  return (
    <section className="min-h-screen text-green-900 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-6">
          About <span className="text-green-600">JustMatcha</span>
        </h1>

        <p className="text-lg leading-relaxed mb-10">
          At <strong>JustMatcha</strong>, we believe in more than just a drink — we believe in a lifestyle. 
          Sourced from the lush valleys of Japan, our matcha is 100% organic, sustainably harvested, 
          and packed with energy to fuel your focus and chill your vibe. 🌱
        </p>

        <div className="grid sm:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">🌿 Our Mission</h2>
            <p className="text-base leading-loose">
              We're on a mission to bring premium-grade matcha to every desk, gym bag, and kitchen counter.
              From wellness lovers to caffeine switchers, JustMatcha is your go-to blend of clarity, energy, and calm.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">💚 Why Matcha?</h2>
            <p className="text-base leading-loose">
              Unlike your average cup of joe, matcha offers slow-release energy without the crash. It's rich in antioxidants, 
              supports metabolism, and keeps your mind zen and laser-focused.
            </p>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">👩‍🔬 Meet the Founder</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://placehold.co/150x150?text=Founder"
              alt="Founder"
              className="w-36 h-36 rounded-full object-cover shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold">Aiko Nakamura</h3>
              <p className="text-base leading-relaxed mt-2">
                Aiko grew up in Kyoto surrounded by tea farms. After moving to the city, she realized how hard it was to find authentic,
                high-quality matcha. So she started JustMatcha — to share the taste of home with the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
