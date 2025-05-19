import React from "react";

export default function title(props: { children: React.ReactNode }) {
    return (
        <h1 className="font-bold sm:text-4xl text-2xl flex gap-4 items-center relative mt-10">
            {props.children}
        </h1>
    );
}
