'use client'

import React, { useContext } from "react";
import { ReactTyped } from "react-typed";
import Button from "./Button";
import { AppContext } from "../Context/AppContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"

export default function Herocomp() {

  const router = useRouter()

  function gotoapp() {
    router.push('/Mainapp')
  }
  function loginbutton() {
    router.push('/Login')
  }


  const { user } = useContext(AppContext)

  return (
    <section className="flex flex-col justify-center items-center h-screen py-12 px-4 md:p-8">
      <motion.div

        initial={{ opacity: 0, scale: 0.5 }}        // before visible
        whileInView={{ opacity: 1, scale: 1 }}     // when in viewport
        transition={{ duration: 1.4, ease: "backOut" }}
        viewport={{ once: true, amount: 0.2 }} // run once, when 20% of div is visible

        className="flex flex-col text-[#213555]  items-center justify-center rounded-3xl mt-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-snug mb-6 text-center text-engraved ">
          Analyze Your <br /> Website’s{" "}
          <span className="text-[#1b4c9c]">
            <ReactTyped
              strings={["SEO", "Speed", "Performance"]}
              typeSpeed={80}
              backSpeed={50}
              backDelay={1500}
              loop
            />
          </span>{" "}
          <br />
          and Get Instant AI Recommendations
        </h1>
        <p className="text-md md:text-xl text-gray-500  max-w-3xl text-center leading-relaxed">
          Instantly scan any site and receive tailored suggestions from our AI.
        </p>
      </motion.div>

      <div className="flex gap-3 items-center justify-center mt-8">
        {user ? <Button buttonname={"Go to app"} onclickfunction={gotoapp} />
          : <Button buttonname={"login"} onclickfunction={loginbutton} />
        }

        <Button buttonname={"See Demo"} />
      </div>

    </section>

  );
}
