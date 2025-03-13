"use client";
import { forwardRef, useState } from "react";

const Input = forwardRef(function TextField(
    props: {
        placeholder: string;
        className?: string;
        name: string;
        type?: string;
        ref?: any;
        error?: boolean;
        disabled?: boolean;
        defaultValue?: string;
        onBlur?: (e: any) => void
    },
    ref: any
) {
    const [inputHasText, setInputHasText] = useState(Boolean(props.defaultValue));
    return (
        <div className="h-20 relative">
            <div className="absolute w-full flex justify-center items-center h-10 bottom-0 2xl:text-base text-md ">
                <input
                    autoComplete="on"
                    id={props.name}
                    ref={ref}
                    type={props.type || "text"}
                    name={props.name}
                    disabled={props.disabled}
                    defaultValue={props.defaultValue}
                    onBlur={e => {
                        setInputHasText(e.target.value !== "");
                        if (props.onBlur) {
                            props.onBlur(e);
                        }
                    }}
                    maxLength={100}
                    className={
                        "h-10 w-full border-b border-gray-300 focus:outline-none peer z-10 bg-transparent " +
                        (props.error ? " border-red-500 " : "") + (props.className || "")
                    }
                />{" "}
                <label
                    htmlFor={props.name}
                    className={
                        "absolute rtl:right-3 ltr:left-3 text-gray-400  peer-focus:text-custom-light-purple transition-all h-full grid place-items-center text-nowrap " +
                        (inputHasText
                            ? "-translate-y-[90%] text-sm"
                            : "peer-focus:-translate-y-[90%] peer-focus:text-sm")
                    }
                >
                    {props.placeholder}
                </label>
            </div>
        </div>
    );
});

export default Input;
