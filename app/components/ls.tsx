"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src="/ls.png"
        alt="Loading"
        width={200}
        height={200}
        priority
      />
    </div>
  );
}
