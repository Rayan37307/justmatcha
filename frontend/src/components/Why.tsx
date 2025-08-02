import React from 'react'

const Why = () => {
    const WhyData = [
        {
            name: "Energy",
            icon: "/energy.png",
        },
        {
            name: "Focus",
            icon: "/focus.png",
        },
        {
            name: "Clarity",
            icon: "/clarity.png",
        },
        {
            name: "Antioxidants",
            icon: "/antioxidants.png",
        }
    ]
  return (
    <div className='flex flex-col justify-center items-center'>
        <h3 className='text-[48px] my-10 text-center font-bold text-green-900'>Why JustMatcha?</h3>
        <div className='bg-[#AADA91] text-black rounded-xl w-full p-10'>
            <div className='flex justify-between items-center flex-wrap'>

            {WhyData.map((data, i) => (
                <div key={i} className='flex justify-center flex-col items-center px-10'>
                    <img src={data.icon} alt={data.name} />
                    <h3 className='text-2xl'>{data.name}</h3>
                </div>
            ))}
            </div>
        </div>

    </div>
  )
}

export default Why
