"use client";
import React from "react";
import Button from "../common/buttons/button";
import Image from "next/image";
import userIcon from "@/assets/land-assets/user-icon.svg";
import eventIcon from "@/assets/land-assets/event-icon.svg";
import effectLeft from "@/assets/land-assets/landing-page-effect-left.svg";
import titleEffect from "@/assets/land-assets/title-effect.svg";
import testimonial1 from "@/assets/land-assets/testimonial-1.svg";
import testimonial2 from "@/assets/land-assets/testimonial-2.svg";
import testimonial3 from "@/assets/land-assets/testimonial-3.svg";
import glow from "@/assets/land-assets/glow.svg";
import { Calendar } from "@/components/common/shadcn-ui/calendar";
import { motion } from "framer-motion";
import AnimatedCounter from "../common/animatedCounter";
import Link from "next/link";

export default function HeroSection() {
    return (
        <motion.div
            animate="animate"
            className="relative grid place-items-center"
        >
            <div className="flex justify-center items-center h-[80vh] max-h-[900px] px-8 relative">
                <div className="absolute -z-10 hidden md:block">
                    <Image src={glow} alt="" />
                </div>
                <motion.div
                    className="text-center max-w-xl"
                    variants={{
                        animate: { opacity: 1, y: 0 },
                    }}
                    initial={{ opacity: 0, y: 50 }}
                >
                    <Image
                        src={titleEffect}
                        className="absolute -z-10 lg:block hidden"
                        alt="effect"
                    />
                    <h1 className="text-custom-black text-5xl font-bold mb-4 leading-snug">
                        ننسق{" "}
                        <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
                            فعالياتك التعليمية{" "}
                        </span>
                        من الاف الى الياء
                    </h1>
                    <p className="text-custom-gray text-lg font-light mb-4">
                        منسق هي منصة متكاملة لإدارة الفعاليات التعليمية الحضورية
                        و الالكترونية مثل الدورات و ورش العمل و المحاضرات
                    </p>
                    <div className="flex justify-center">
                        <Link href="signin"> <Button gradient>انضم الينا</Button></Link>
                    </div>
                </motion.div>
                <motion.div
                    className="absolute bottom-5 -left-40 hidden lg:block"
                    variants={{ animate: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: -100 }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.div
                        className="w-80 max-w-md p-4 bg-white border border-gray-200 rounded-3xl shadow-xl sm:p-4"
                        animate={{
                            y: [0, 10, 0],
                            transition: {
                                repeat: Infinity,
                                duration: 5,
                                delay: 1,
                            },
                        }}
                    >
                        <div className="flow-root">
                            <ul
                                role="list"
                                className="divide-y divide-gray-200"
                            >
                                <li className="py-3 sm:py-2">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-10 h-10 rounded-full"
                                                src={testimonial1}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-sm font-medium text-custom-black truncate">
                                                سلطان
                                            </p>
                                            <p className="text-xs text-custom-gray truncate">
                                                منصة منسق سهلت علي كل شيء، أنصح
                                                فيها!
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="py-3 sm:py-2">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-10 h-10 rounded-full"
                                                src={testimonial2}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-sm font-medium text-custom-black truncate">
                                                خلود
                                            </p>
                                            <p className="text-xs text-custom-gray truncate">
                                                المنصه حلوة، فيها دورات متنوعة!
                                            </p>
                                        </div>
                                    </div>
                                </li>

                                <li className="py-3 sm:py-2">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-10 h-10 rounded-full"
                                                src={testimonial3}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-sm font-medium text-custom-black truncate">
                                                نايف
                                            </p>
                                            <p className="text-xs text-custom-gray truncate">
                                                تجربتي مع منسق كانت ممتازة جداً!
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute top-20 -left-44 hidden lg:block"
                    variants={{ animate: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: -100 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="w-48 h-48 bg-white border border-gray-200 rounded-3xl shadow-xl text-center flex flex-col items-center justify-center"
                        animate={{
                            y: [0, -10, 0],
                            transition: {
                                repeat: Infinity,
                                duration: 5,
                                delay: 1,
                            },
                        }}
                    >
                        <AnimatedCounter from={0} to={2874} />
                        <p className="font-light text-xl text-custom-gray">
                            مستفيد
                        </p>
                        <Image src={userIcon} alt={""} />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute top-0 -right-44 hidden lg:block"
                    variants={{ animate: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: 100 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="w-48 h-48 bg-white border border-gray-200 rounded-3xl shadow-xl text-center flex flex-col items-center justify-center"
                        animate={{
                            y: [0, 10, 0],
                            transition: {
                                repeat: Infinity,
                                duration: 5,
                                delay: 1,
                            },
                        }}
                    >
                        <AnimatedCounter from={0} to={361} />
                        <p className="font-light text-xl text-gray-500">
                            فعاليه
                        </p>
                        <Image src={eventIcon} alt={""} />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute -bottom-24 -right-60 hidden lg:block"
                    variants={{ animate: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: 100 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.div
                        className="bg-white border border-gray-200 rounded-3xl shadow-xl py-4 px-6"
                        animate={{
                            y: [0, -10, 0],
                            transition: {
                                repeat: Infinity,
                                duration: 5,
                                delay: 1,
                            },
                        }}
                    >
                        <h5 className="text-2xl font-semibold tracking-tight bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent text-center mb-2">
                            نسق فعالياتك بسهوله
                        </h5>
                        <Calendar />
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute -top-[10%] left-0 -z-10">
                <Image src={effectLeft} alt="" />
            </div>
            <div className="absolute top-[25%] right-0 -z-10 rotate-180">
                <Image src={effectLeft} alt="" />
            </div>
            {/* <div className="absolute top-[100%] left-0 -z-10">
                <Image src={effectLeft} alt="" />
            </div>
            <div className="absolute top-[150%] right-0 -z-10 rotate-180">
                <Image src={effectLeft} alt="" />
            </div> */}
        </motion.div>
    );
}
