"use client";

import Image from "next/image";
import logoIcon from "@/assets/logo/logo-small-white.svg";
import munaseq from "@/assets/logo/munaseq-text.svg";
import Progress from "@/components/auth/signup-progress";
import { motion, useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MainForm from "@/components/auth/main-form";
import ProfileForm from "@/components/auth/profile-form";
import TagForm from "@/components/auth/catagory-form";
import FinalForm from "@/components/auth/final-form";
import { signupAction } from "@/proxy/signup-action";
import ErrorForm from "@/components/auth/error-form";

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [scope, animate] = useAnimate();
    const [error, setError] = useState({ message: "" });
    const [isLoading, setIsLoading] = useState(false);

    // to watch the height of the form
    const [observedModalHeight, setObservedModalHeight] = useState<
        number | "auto"
    >("auto");

    const [observedLinkHeight, setObservedLinkHeight] = useState<
        number | "auto"
    >("auto");

    const modalHeightTrackRef = useRef<HTMLDivElement | null>(null);
    const linkHeightTrackRef = useRef<HTMLAnchorElement | null>(null);

    const categories: MutableRefObject<string[]> = useRef([]);
    const ref = useRef({} as HTMLFormElement);
    const router = useRouter();

    const transition = {
        type: "spring",
        duration: 0.5,
        bounce: 0,
    };

    // This function will be called when the user clicks on the sign in button and handles the transition to the sign in page
    const transitionToSignUpHandler = async () => {
        animate(
            "#card",
            {
                x: "-50%",
                opacity: 0,
            },
            { type: "spring", duration: 0.5, bounce: 0 }
        );

        await new Promise(resolve => setTimeout(resolve, 500));

        router.push("/signin");
    };

    const nextStepHandler = (e: MouseEvent) => {
        e.preventDefault();
        if (step === 4) {
            return;
        }
        setStep(prevStep => prevStep + 1);
    };
    const prevStepHandler = (e: MouseEvent) => {
        e.preventDefault();
        if (step === 1) {
            return;
        }
        setStep(prevStep => prevStep - 1);
    };

    let formData: MutableRefObject<FormData> = useRef(new FormData());

    const formFinalization = async (selectedCategories: string[]) => {
        // Save the selected categories in a ref
        categories.current = selectedCategories;
        formData.current = new FormData(ref.current);
        for (const category of categories.current) {
            formData.current.append("categories", category);
        }

        const image = formData.current.get("profileImage") as File;

        if (image.size > 0) {
            formData.current.set("profileImage", image);
        }
        if (image.size === 0) {
            formData.current.delete("profileImage");
        }

        // translates gender to english
        const formGender = formData.current.get("gender");
        switch (formGender) {
            case "ذكر":
                formData.current.set("gender", "MALE");
                break;
            case "انثى":
                formData.current.set("gender", "FEMALE");
                break;
        }
    };

    useEffect(() => {
        if (modalHeightTrackRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                // We only have one entry, so we can use entries[0].

                setObservedModalHeight(entries[0].contentRect.height);
                if (linkHeightTrackRef.current) {
                    setObservedLinkHeight(
                        linkHeightTrackRef.current.offsetHeight
                    );
                }
            });

            resizeObserver.observe(modalHeightTrackRef.current);
            return () => {
                // Cleanup the observer when the component is unmounted
                resizeObserver.disconnect();
            };
        }
    }, []);

    return (
        <div ref={scope}>
            <motion.div
                initial={{ x: "-50%", opacity: 0 }}
                animate={{
                    x: 0,
                    opacity: 1,
                    height: observedModalHeight,
                }}
                transition={transition}
                id="card"
                className="bg-white w-[min(900px,90vw)] shadow-strong rounded-[50px] overflow-hidden grid items-center"
            >
                <div ref={modalHeightTrackRef} className="">
                    <div
                        ref={scope}
                        className="grid md:grid-cols-2 md:gap-0 gap-3 md:h-full place-items-center relative md:p-14 p-10"
                    >
                        <div className="h-full w-full flex flex-col md:gap-5 ">
                            <Progress step={step} />
                            <Link
                                ref={linkHeightTrackRef}
                                className="w-full h-full md:block hidden"
                                href={"/"}
                            >
                                <motion.div
                                    animate={{ height: observedLinkHeight }}
                                    className="w-full h-full rounded-[50px] bg-gradient-to-br to-custom-dark-purple from-custom-light-purple overflow-hidden items-center flex flex-col justify-center gap-14  "
                                >
                                    <Image
                                        src={logoIcon}
                                        className="w-32"
                                        alt="logo"
                                    />
                                    <Image
                                        src={munaseq}
                                        className="w-48"
                                        alt="munaseq"
                                    />
                                </motion.div>
                            </Link>
                        </div>

                        <div className="w-full md:p-10 flex flex-col items-center justify-center exit-right overflow-hidden pt-5">
                            <form
                                ref={ref}
                                onSubmit={async e => {
                                    e.preventDefault();
                                    setIsLoading(true);
                                    const error = await signupAction(
                                        formData.current
                                    );
                                    setIsLoading(false);
                                    if (error?.message) {
                                        setError({ message: error.message });
                                    }
                                }}
                                className="max-w-96 w-full relative grid place-items-center"
                            >
                                {!error.message ? (
                                    <>
                                        <MainForm
                                            step={step}
                                            transitionToSignUpHandler={transitionToSignUpHandler}
                                            nextStepHandler={nextStepHandler}
                                        />
                                        <ProfileForm
                                            step={step}
                                            nextStepHandler={nextStepHandler}
                                            prevStepHandler={prevStepHandler}
                                        />
                                        <TagForm
                                            step={step}
                                            nextStepHandler={nextStepHandler}
                                            prevStepHandler={prevStepHandler}
                                            submitCategories={formFinalization}
                                        />
                                        <FinalForm
                                            isLoading={isLoading}
                                            step={step}
                                            prevStepHandler={prevStepHandler}
                                            formData={formData.current}
                                        />
                                    </>
                                ) : (
                                    <ErrorForm message={error.message} />
                                )}
                            </form>
                            
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
