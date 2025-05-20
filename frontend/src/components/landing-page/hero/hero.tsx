"use client";

import Image from "next/image";
import heroBg from "@/assets/new-landing-assets/hero/hero-bg.svg";
import titleGlow from "@/assets/new-landing-assets/hero/title-glow.png";
import heroLeftDeco from "@/assets/new-landing-assets/hero/hero-left-deco.png";
import HeroLottie from "./hero-lottie";
import HeroText from "./hero-text";
import heroRightDeco from "@/assets/new-landing-assets/hero/hero-right-deco.png";
import { motion } from "framer-motion";
import ParticlesBg from "./particles-bg";

export default function Hero() {
    return (
        <section className="flex lg:justify-end items-end lg:items-stretch lg:flex-row flex-col-reverse">
            {/* <div className="lg:block hidden">
                <ParticlesBg />
            </div> */}
            <div className="flex lg:justify-between justify-center items-center flex-1  lg:w-auto w-full">
                <div className="h-full lg:block hidden relative ">
                    {/* <Image
                        src={titleGlow}
                        alt="glow"
                        className=" h-full absolute"
                    /> */}
                    <Image
                        src={heroRightDeco}
                        alt="deco"
                        className="h-full aspect-square min-w-24"
                    />
                </div>
                <HeroText />
            </div>
            <div className="grid place-items-center relative">
                <ParticlesBg />
                <div className="grid place-items-center relative overflow-y-hidden  overflow-x-clip lg:ps-5">
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: "-200%" }}
                        transition={{ duration: 1 }}
                        className="w-full h-full absolute z-10"
                    >
                        <div className="bg-white w-full h-full" />
                        <div className=" bg-gradient-to-b from-white to-transparent h-full" />
                    </motion.div>
                    <Image
                        className="md:w-[45vw] md:min-w-[600px] w-full drop-shadow-pink"
                        src={heroBg}
                        alt="background image"
                        priority
                    />
                    <div className="absolute w-[90%] max-w-[900px] grid place-items-center">
                        <HeroLottie />
                        <Image
                            src={heroLeftDeco}
                            alt="deco"
                            className="absolute -z-10 w-full aspect-square"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
