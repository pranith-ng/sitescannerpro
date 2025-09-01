import React, { useState } from "react";
import { RiAccountCircle2Line } from "react-icons/ri";
import {useRouter} from "next/navigation"


const MainNavbar = () => {

  const router = useRouter()

  const gotoaccount = () => router.push('/Account');

  return (
    <>
      <nav className="flex items-center justify-between h-16 px-4 max-w-[1300px] m-auto bg-[#E0DAD0] text-[#1b4c9c] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-4">
         
          <h1 className="text-xl font-semibold select-none">SiteScannerPro</h1>
        </div>

        <div>
           <button 
          onClick={gotoaccount}
          className="neumorphic rounded-full p-[8px] text-3xl "><RiAccountCircle2Line /></button>
        </div>
      </nav>

      
      <div className="pt-16">
      </div>
    </>
  );
};

export default MainNavbar;
