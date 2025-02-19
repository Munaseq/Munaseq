import React from "react";
import Image from "next/image";
import discover from "@/assets/icons/discover-active.svg";

export default function title(props: { children: React.ReactNode }) {
  return (
    <div className="mb-6 mt-10">
      <h1 className="font-bold sm:text-4xl text-2xl flex gap-4 items-center relative">{props.children}</h1>
    </div>
  );
}
