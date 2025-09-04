"use client"

import React from 'react'
import { HiOutlineHome } from "react-icons/hi";
import { useRouter } from 'next/navigation';


const page = () => {

    const router = useRouter()

    return (
        <div className='flex flex-col justify-center items-center gap-8 p-8 max-w-[1200px] m-auto'>
            <button

                onClick={() => router.push("/")}
                className='p-[12px] text-2xl rounded-full text-[#1b4c9c] font-extrabold'>
                <HiOutlineHome />
            </button>
            <video
                className="!text-shadow-none"
                controls
                autoPlay={false}
                src="/demovideo.mp4">

                Your browser does not support the video tag.

            </video>
        </div>
    )
}

export default page
