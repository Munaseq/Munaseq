"use client";

import waveTop from "@/assets/new-landing-assets/features/wave-top.png";
import waveBottom from "@/assets/new-landing-assets/features/wave-bottom.png";
import Image from "next/image";
import editIcon from "@/assets/new-landing-assets/features/icons/edit-icon.svg";
import aIIcon from "@/assets/new-landing-assets/features/icons/ai-icon.svg";
import joinIcon from "@/assets/new-landing-assets/features/icons/join-icon.svg";
import bottomLeftDeco from "@/assets/new-landing-assets/features/bottom-left-deco.png";
import topRightDeco from "@/assets/new-landing-assets/features/top-right-deco.png";
import { motion, Variants } from "framer-motion";

export default function Features() {
    const variants: Variants = {
        beforeSlide: { y: 100, opacity: 0 },
        afterSlide: { y: 0, opacity: 1 },
    };

    return (
        <section className="grid place-items-center relative">
            <h2 className="text-5xl font-semibold lg:mt-10 mt-20">
                مزايا
                <span className="bg-custom-gradient text-transparent bg-clip-text">
                    {" "}
                    منسق
                </span>
            </h2>
            <div className="relative overflow-x-hidden mt-3">
                <motion.div
                    initial={{ x: 0 }}
                    whileInView={{ x: "100%" }}
                    viewport={{ margin: "-300px 0px", once: true }}
                    transition={{ duration: 1 }}
                    className="absolute bg-gradient-to-r from-transparent to-50% to-white h-full w-[200%] z-10"
                />
                <div className=" relative overflow-hidden pt-10">
                    <Image className="w-screen drop-shadow-wave" src={waveTop} alt="wave top" />
                    <Image
                        src={topRightDeco}
                        alt="deco"
                        className="absolute right-0 top-0 -z-10 sm:block hidden"
                    />
                </div>

                <motion.div
                    initial={"beforeSlide"}
                    whileInView={"afterSlide"}
                    viewport={{ margin: "-300px 0px", once: true }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                    className="bg-gradient-to-r to-[#AE00FE] from-[#652BB7] w-screen text-white flex lg:flex-row flex-col justify-center  items-center lg:py-10 py-20 gap-20"
                >
                    <motion.div
                        variants={variants}
                        className="flex flex-col w-72 gap-2"
                    >
                        <Image
                            src={editIcon}
                            alt="coordinate event icon"
                            className="w-14 aspect-square"
                        />
                        <h2 className="font-semibold text-3xl">
                            نسق فعاليتك بسهولة
                        </h2>
                        <p>
                            أنشئ فعالياتك التعليمية وأدر جميع تفاصيلها بكل
                            مرونة.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={variants}
                        className="flex flex-col w-72 gap-2"
                    >
                        <Image
                            src={joinIcon}
                            alt="join event icon"
                            className="w-14 aspect-square"
                        />
                        <h2 className="font-semibold text-3xl">
                            انضم للفعالية ببساطة
                        </h2>
                        <p>
                            ابحث عن الفعاليات التعليمية التي تهمك وسجل فيها
                            بسهولة. 
                        </p>
                    </motion.div>
                    <motion.div
                        variants={variants}
                        className="flex flex-col w-72 gap-2"
                    >
                        <Image
                            src={aIIcon}
                            alt="AI icon"
                            className="w-14 aspect-square"
                        />
                        <h2 className="font-semibold text-3xl">
                            أدوات الذكاء اصطناعي
                        </h2>
                        <p>
                            استمتع بتجربة تعليمية متطورة مع أدوات الذكاء
                            الاصطناعي التي تساعد في إنتاج الأنشطة تلقائيًا.
                        </p>
                    </motion.div>
                </motion.div>
                <div className="overflow-hidden relative pb-10">
                    <Image
                        className="w-screen drop-shadow-wave"
                        src={waveBottom}
                        alt="wave bottom"
                    />
                    <Image
                        src={bottomLeftDeco}
                        alt="deco"
                        className="absolute left-0 bottom-0 -z-10 sm:block hidden"
                    />
                </div>
            </div>
        </section>
    );
}
