"use client";

import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

export default function Category(props: {
    onClick?: (e: any) => void;
    checked?: boolean;
    active?: boolean;
    children: string;
    selected?: boolean;
}) {
    return (
        <motion.button
            layout
            animate={{ backgroundColor: props.selected ? "#F5F5F5" : "#FFFFFF" }}
            onClick={e => {
                e.preventDefault();
                if (props.active) {
                  
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }
            }}
            className={
                "bg-white border-pirmary border-2 rounded-3xl px-3 py-2 relative z-10 text-custom-light-purple font-bold flex justify-center items-center gap-2 group text-nowrap " +
                (!props.active ? " cursor-default" : "")
            }
        >
            <motion.div layout>{props.children}</motion.div>
            {props.selected && (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ y: 10, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <XIcon className="text-custom-black"/>
                </motion.div>
            )}
        </motion.button>
    );
}
