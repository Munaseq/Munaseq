import CategoryComponent from "@/components/common/category";
import Button from "@/components/common/buttons/button";
import { motion, Variants } from "framer-motion";
import { Category } from "@/util/categories";
import {useState } from "react";
import useFormVariants from "./hooks/use-form-variants";

export default function CategoryForm(props: {
    step: number;
    nextStepHandler: (e: MouseEvent) => void;
    prevStepHandler: (e: MouseEvent) => void;
    submitCategories: (categories: string[]) => void;
}) {
    const [formError, setFormError] = useState(false);
    const [selectedCatagories, setSelectedCatagories] = useState<string[]>([]);

    const variants: Variants = useFormVariants();

    const validateInputs: () => boolean = () => {
        if (selectedCatagories.length === 0) {
            setFormError(true);
            return false;
        }
        setFormError(false);
        return true;
    };

    return (
        <motion.div
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            initial={"next"}
            animate={
                props.step === 3 ? "active" : props.step > 3 ? "past" : "next"
            }
            variants={variants}
            className="w-full"
        >
            <motion.h1 layout className="font-bold text-3xl text-center">
                {" "}
                اختر اهتماماتك
            </motion.h1>

            <motion.div className="flex flex-wrap gap-2 mt-10 sm:text-[0.75rem] text-xs ">
                {Object.values(Category).map((category, index) => (
                    <CategoryComponent
                        active
                        selected={selectedCatagories.includes(category)}
                        onClick={() => {
                            if (selectedCatagories.includes(category)) {
                                setSelectedCatagories(prevState => {
                                    return prevState.filter(t => t !== category);
                                });
                                return;
                            }
                            setSelectedCatagories(prevState => [
                                ...prevState,
                                category,
                            ]);
                        }}
                        key={index}
                    >
                        {category}
                    </CategoryComponent>
                ))}
            </motion.div>

            <motion.div layout className="mt-5">
                {formError && (
                    <motion.div
                        layout
                        animate={{ y: 0, opacity: 1 }}
                        initial={{ y: 12, opacity: 0 }}
                        transition={{ delay: 0.225 }}
                        className="text-red-500 text-center mt-5"
                    >
                        يجب اختيار واحد على الاقل
                    </motion.div>
                )}
                <motion.div layout className="flex justify-between">
                    <Button
                        disabled={props.step !== 3}
                        onClick={props.prevStepHandler}
                        className="mt-10 bg-transparent !text-custom-gray hover:!bg-[hsl(0,0%,92%)]"
                    >
                        السابق
                    </Button>
                    <Button
                        disabled={props.step !== 3}
                        onClick={async e => {
                            e.preventDefault();
                            if (validateInputs()) {
                                props.submitCategories(selectedCatagories);
                                props.nextStepHandler(e);
                            }
                        }}
                        className="mt-10 shadow-xl px-9 "
                    >
                        التالي
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
