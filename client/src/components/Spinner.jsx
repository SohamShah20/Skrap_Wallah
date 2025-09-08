import React from 'react'
import { BarLoader } from 'react-spinners';
import logo from '../assets/spin.png';
const Spinner = () => {
  return (
    <div className=" fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-[#0F0F0F] z-50">
    {/* Image above the spinner */}
    <img src={logo} alt="Loading Logo" className="mb-4 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover" />
     
    <h1 className='text-white text-2xl mb-4'>S K R A P</h1>
    <span className='text-white text-3xl ml-4 mb-7'> W A L L A H</span>

    {/* Colorful spinner */}
    <BarLoader color="#84cc16" height={6} width={350} />
  </div>
);
}
export default Spinner;
