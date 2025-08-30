'use client'

import { useContext } from "react";
import { RiAccountCircle2Line } from "react-icons/ri";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { AppContext } from "../Context/AppContext";



export default function Navbar() {

  const { user } = useContext(AppContext)

  const router = useRouter()

  function signupbuttonhandle() {
    router.push('/SignUp')
  }

  
   const gotoaccount = () => router.push('/Account');

  return (
    <nav className="fixed top-0 left-0 w-full px-4 z-50 md:px-16 ">
      <div className="max-w-[1300px] m-auto flex justify-between items-center py-5 ">

        <span className="font-semibold text-xl text-[#1b4c9c]">SiteScannerPro</span>

        {user ?
          <div>
            <button
              onClick={gotoaccount}
              className={`neumorphic rounded-full p-[8px] text-3xl ${user ? "text-[#1b4c9c]" : "text-grey-500"}`}><RiAccountCircle2Line /></button>
          </div>

          : <Button buttonname={"Sign up"} onclickfunction={signupbuttonhandle} />

        }

      </div>
    </nav>
  );
}
