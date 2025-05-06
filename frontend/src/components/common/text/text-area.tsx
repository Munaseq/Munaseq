"use client";

import { forwardRef } from "react";

const TextArea = forwardRef(function TextArea(
    props: {
        placeholder: string;
        className?: string;
        name: string;
        cols?: number;
        rows?: number;
        defaultValue?: string;
        onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        value?: string;
    },
    ref: any
) {
    return (
        <div className="relative grid items-center">
            <label htmlFor={props.name} className="text-gray-400 text-md ms-3">
                {props.placeholder}
            </label>
            <textarea
            value={props.value}
                ref={ref}
                id={props.name}
                name={props.name}
                cols={props.cols}
                defaultValue={props.defaultValue}
                maxLength={500}
                onChange={props.onChange}
                className={"w-full h-28 min-h-32 border-b border-gray-300 focus:outline-none peer resize-none bg-transparent z-10"+ props.className}
            />
        </div>
    );
});

export default TextArea
