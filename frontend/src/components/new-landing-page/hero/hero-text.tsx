"use client";

import Button from "@/components/common/buttons/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroText() {
    return (
        <motion.div
            animate={{ x: 0, opacity: 1 }}
            initial={{ x: 100, opacity: 0 }}
            transition={{ bounce: 0, type: "spring" , delay: 0.5}}
            className="grid gap-5 p-5 lg:max-w-[700px] max-w-[500px]"
        >
            <h1 className="font-semibold text-[clamp(2.5em,4vw,4em)]">
                ننسق
                <span className="bg-custom-gradient text-transparent bg-clip-text">
                    {" "}
                    فعالياتك التعليمية{" "}
                </span>{" "}
                من الالف الى الياء
            </h1>
            <p className="sm:text-xl text-lg text-custom-gray">
                منسق هي منصة متكاملة لإدارة الفعاليات التعليمية الحضورية و
                الالكترونية مثل الدورات و ورش العمل و المحاضرات
            </p>
            <Link href={'/signup'}>
                <Button className="w-min px-9" gradient>
                    انضم الينا
                </Button>
            </Link>
        </motion.div>
    );
}
