import React from "react";
import Image from "next/image";

const Screenshot = ({ data }) => {
  if (!data?.lighthouseResult) return null;

  const screenshotData = data.lighthouseResult.audits["final-screenshot"]?.details?.data;

  if (!screenshotData) return null;

  return (
    <div className="">
      <h2 className="py-4 text-xl text-center md:py-6 font-semibold ">Page Screenshot:</h2>
      <div className="relative w-full max-w-3xl h-70 mx-auto overflow-hidden md:h-96">
        <Image
          src={screenshotData}
          alt="Page Screenshot"
          layout="fill"
          objectFit="contain"
          priority
          className="rounded"
        />
      </div>
    </div>
  );
};

export default Screenshot;
