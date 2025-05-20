"use client";

import MemberCard from "@/components/landing-page/work-team/member-card";
import { motion, Variants } from "framer-motion";
import hussam from "@/assets/new-landing-assets/work-team/hussam.png";
import mahmoud from "@/assets/new-landing-assets/work-team/mahmoud.png";
import hisham from "@/assets/new-landing-assets/work-team/hisham.png";
import fadl from "@/assets/new-landing-assets/work-team/fadl.png";

export default function WorkTeam() {
    const variants: Variants = {
        beforeSlide: { y: 100, opacity: 0 },
        afterSlide: { y: 0, opacity: 1 },
    };

    return (
        <section className="grid place-items-center  ">
            <h1 className="text-5xl/snug  font-semibold my-10 text-center max-w-[27rem]">
                فريق عمل
                <span className="bg-custom-gradient text-transparent bg-clip-text">
                    {" "}
                    منسق
                </span>
            </h1>
            <motion.div
                initial={"beforeSlide"}
                whileInView={"afterSlide"}
                viewport={{ margin: "-100px 0px", once: true }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                className="flex flex-row flex-wrap justify-center items-center gap-20 mb-10 px-5 w-full"
            >
                <motion.div className="max-w-96 w-full" variants={variants}>
                    <MemberCard
                        linkedin="https://www.linkedin.com/in/hussam-alqannam-9ab206299/"
                        image={hussam}
                        cv="hussam-cv.pdf"
                        name="حسام القنام"
                        role="مطور واجهات امامية"
                    />
                </motion.div>
                <motion.div className="max-w-96 w-full" variants={variants}>
                    <MemberCard
                        linkedin="https://www.linkedin.com/in/mohammed-al-mahmud-413371347/"
                        image={mahmoud}
                        cv="mohammed-mahmud-cv.pdf"
                        name="محمد ال محمود"
                        role="مطور واجهات امامية"
                    />
                </motion.div>
                <motion.div className="max-w-96 w-full" variants={variants}>
                    <MemberCard
                        linkedin="https://www.linkedin.com/in/hisham-alsuhaibani-649a8a238/"
                        image={hisham}
                        cv="hisham-cv.pdf"
                        name="هشام السحيباني"
                        role="مطور واجهات خلفية"
                    />
                </motion.div>
                <motion.div className="max-w-96 w-full" variants={variants}>
                    <MemberCard
                        linkedin="https://www.linkedin.com/in/mohammed-alfadl/"
                        image={fadl}
                        cv="mohammed-fadl-cv.pdf"
                        name="محمد الفضل"
                        role="مطور واجهات خلفية"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
