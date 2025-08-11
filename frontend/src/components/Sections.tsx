

const Sections = () => {
  return (
    <div className="flex flex-wrap items-center justify-center mt-20 mb-20">
        <div className='flex flex-wrap items-center justify-center'>

        <div className="flex flex-col justify-center items-center md:w-1/2">
            <img src="/diff.png" alt="" className="w-full object-cover rounded-sm h-full max-h-[640px]" />
        </div>
        <div className="flex flex-col justify-center items-start md:w-1/2 md:pl-10">
            <h1 className="text-3xl text-green-900 mb-5">The Matcha Difference</h1>
            <p className="text-lg">Matcha isn’t just tea – it’s a full-leaf superfood. By consuming the whole leaf, you get more nutrients, more antioxidants, and longer-lasting energy than coffee or regular green tea.</p>
            <button className="bg-green-900 text-white px-10 py-3 rounded-sm mt-6 md:mt-10">Learn More</button>

        </div>
        </div>
        <div className='flex flex-wrap items-center justify-center'>

        <div className="flex flex-col justify-center items-start md:w-1/2 md:pl-10">
            <h1 className="text-3xl text-green-900 mb-5">Healthy Coffee Alternative</h1>
            <p className="text-lg">All the energy, none of the jitters. Matcha provides a calm, focused boost thanks to its unique balance of caffeine and L-theanine – making it the smarter way to power through your day.</p>
            <button className="bg-green-900 text-white px-10 py-3 rounded-sm mt-6 md:mt-10">FAQ</button>

        </div>

        <div className="flex flex-col justify-center items-center md:w-1/2">
            <img src="/2big.png" alt="" className="w-full object-cover rounded-sm h-full max-h-[640px]" />
        </div>
        </div>
        <div className='flex flex-wrap items-center justify-center'>

        <div className="flex flex-col justify-center items-center md:w-1/2">
            <img src="/3big.png" alt="" className="w-full object-cover rounded-sm h-full max-h-[640px]" />
        </div>
        <div className="flex flex-col justify-center items-start md:w-1/2 md:pl-10">
            <h1 className="text-3xl text-green-900 mb-5">Our Promise</h1>
            <p className="text-lg">Grown in Japan. Certified Organic. We source AAA-grade matcha directly from sustainable Japanese farms. No additives, no compromise – just pure, vibrant green goodness.</p>
            <button className="bg-green-900 text-white px-10 py-3 rounded-sm mt-6 md:mt-10">Shop Now</button>

        </div>
        </div>
    </div>
  )
}

export default Sections
