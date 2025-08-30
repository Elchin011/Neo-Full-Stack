"use client"
import React, { useEffect, useState } from "react";

const Appointment = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full h-[850px] bg-cover bg-center flex items-center justify-center "
      style={{
        backgroundImage: "url(https://neoocular.qodeinteractive.com/wp-content/uploads/2021/10/h1-paralax-img-00001.jpg)",
        backgroundPosition: `center ${offsetY * 0.21}px`
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white lg:w-[910px] lg:h-[446px] md:w-[768px] md:h-[436px] sm:w-[500px] sm:h-[423px] px-5 py-12 pb-10">
        <h1 className='lg:text-[36px]  font-semibold tracking-[0.1rem] uppercase mt-30'>Book appointment</h1>
        <p className='mt-2.5 mb-6 lg:text-[19px] ] font-light'>Get professional assistance the simplest way</p>
        <div className="border border-[#eee] lg:mx-[131px]  lg:h-[50px] lg:flex items-center justify-between mx-auto overflow-hidden">
          <input placeholder="Type question" type="text" className="w-[65%] sm:w-[60%] border-none outline-none px-3" />
          <button className="bg-black text-white h-full uppercase text-[13px]  font-medium px-8 py-1 lg:px-12.5 lg:py-2">send now</button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
