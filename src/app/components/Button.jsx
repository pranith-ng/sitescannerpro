"use client";

import { useState } from "react";

export default function Button({buttonname, onclickfunction}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onclickfunction}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`px-6 py-3 text-black rounded-4xl transition-all duration-0.3s text-engraved ${
        pressed ? "neumorphic-pressed" : "neumorphic"
      }`}
    >
      {buttonname}
    </button>
  );
}
