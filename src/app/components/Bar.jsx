'use client'
import React, { useState, useEffect } from "react";
import { BsInfo } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";


const Bar = ({ percentage = 75, name }) => {


  const categoryDescriptions = {
    performance: "Shows how quickly your page loads and reacts, helping users get content faster.",
    accessibility: "Checks if your site is easy to use for everyone, including people with disabilities.",
    bestpractices: "Verifies that your site follows web development best practices and avoids common mistakes.",
    seo: "Shows how easily search engines can find and understand your website.",
  };

  const [description, setdescription] = useState("")

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const key = name.toLowerCase().replace(" ", "");
    setdescription(categoryDescriptions[key]);
  }, [name]); 

 const getColor = (value) => {
  if (value < 50) return "#ef4444"; // red
  if (value < 90) return "#eab308"; // yellow
  return "#22c55e"; // green
};


  return (
    <div
      className="cursor-pointer perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`card neumorphic p-6 pt-8 rounded-xl text-center transition-transform duration-500 transform-origin-left ${flipped ? "rotate-y-180 " : "rotate-y-0"
          }`}
        style={{ transformStyle: "preserve-3d" }}
      >


        {/* Front side */}
        <div className="backface-hidden">
          <div className="flex justify-between">
            <span></span>
            <button className="absolute top-3 right-3 neumorphic rounded-full p-1"><BsInfo /></button>
          </div>
          <h2 className="text-xl font-semibold mb-4">{name}</h2>

          {/* Blue progress bar */}
          <div className="progress-bar">
            <div
              className={`progress-fill ${getColor(percentage)}`}
              style={{ width: `${percentage}%`,
               backgroundColor: getColor(percentage),
            }}
            ></div>
          </div>

          <h2 style={{ color: getColor(percentage) }}>
            {`${percentage}%`}
          </h2>
        </div>

      
        <div className="backface-hidden rotate-y-180 absolute top-0 left-0 w-full h-full p-6 pt-8">
          <div className="flex justify-between">
            <span></span>
            <button className="absolute top-3 right-3 neumorphic rounded-full p-1"><IoCloseSharp /></button>
          </div>
          {description}
        </div>
      </div>
    </div>
  );
};

export default Bar;



