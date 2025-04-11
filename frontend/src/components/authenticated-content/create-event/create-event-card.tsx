"use client";

import decoLeft from "@/assets/create-event/deco-left-top.png";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function CreateEventCard({
    children,
    goal,
    actual,
}: Readonly<{ children: React.ReactNode; goal: number; actual: number }>) {
    const variants: Variants = {
        next: {
            x: "-50%",
            opacity: 0,
            display: "none",
            position: 'absolute'
        },
        past: {
            x: "50%",
            opacity: 0,
            display: "none",
            position: 'absolute'
        },
        active: {
            x: 0,
            opacity: 1,
            display: 'block',
            visibility: "visible",
            position: 'relative'
        },
    };
    return (
        <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        initial={goal === 1 ? 'active' : "next"}
        animate={
            actual === goal ? "active" : actual > goal ? "past" : "next"
        }
        variants={variants}
        className={
            "max-w-[45rem] w-[98%] bg-white shadow-md rounded-3xl overflow-hidden p-5 "
        }
        >
            <Image
                alt="deco"
                src={decoLeft}
                className="absolute left-0 top-0"
            />
            <div className="z-10 relative">{children}</div>
        </motion.div>
    );
}
