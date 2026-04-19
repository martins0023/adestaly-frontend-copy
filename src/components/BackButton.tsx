"use client";

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
const router = useRouter()
return (
    <div className="w-full flex fixed top-0 z-20 bg-white justify-between items-center p-3 font-montserrat">
      <button
        className="flex m-1 items-center"
        onClick={() => router.back()}
      >
        <FaArrowLeft />
        <p className="text-black justify-center ml-3 font-semibold text-[14px]">Back</p>
      </button>
    </div>
);
};

export default BackButton;