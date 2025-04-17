"use client";

import { Category } from "@/util/categories";

import { PlusCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/common/shadcn-ui/dialog";
import { DialogHeader } from "../shadcn-ui/dialog";
import CategoryCompoenet from "../category";
import { useState } from "react";
import Button from "./button";

export default function addCategoryModal({
    limit,
    descriptionText,
    onCategorySelect,
    excludedCategories,
}: {
    onCategorySelect: (category: Category[]) => void;
    descriptionText: string;
    excludedCategories: Category[];
    limit?: number;
}) {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        []
    );
    const [overLimit, setOverLimit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resetModal = () => {
        setSelectedCategories([]);
        setOverLimit(false);
        setIsModalOpen(false);
    };

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={() => {
                setSelectedCategories([]);
                setOverLimit(false);
                setIsModalOpen(prev => !prev);
            }}
        >
            <DialogTrigger>
                <motion.div layout className="flex gap-1 px-3 items-center">
                    <span>اضافة</span> <PlusCircleIcon />
                </motion.div>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>اختر ما يهمك</DialogTitle>
                    <DialogDescription>
                       {descriptionText}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 my-4 overflow-hidden">
                    {Object.values(Category).map(category => {
                        if (excludedCategories.includes(category)) return null;
                        return (
                            <CategoryCompoenet
                                notAnimate
                                active
                                key={category}
                                onClick={() =>
                                    setSelectedCategories(prev => {
                                        if (
                                            limit &&
                                            prev.length +
                                                excludedCategories.length >=
                                                limit &&
                                            !prev.includes(category)
                                        ) {
                                            setOverLimit(true);
                                            return prev;
                                        }
                                        setOverLimit(false);
                                        if (prev.includes(category)) {
                                            return prev.filter(
                                                cat => cat !== category
                                            );
                                        } else {
                                            return [...prev, category];
                                        }
                                    })
                                }
                                selected={selectedCategories.includes(category)}
                            >
                                {category}
                            </CategoryCompoenet>
                        );
                    })}
                </div>
                {overLimit && (
                    <div className="text-red-500 mt-2">
                        لقد اخترت أكثر من {limit} فئة. يرجى تقليل الاختيارات.
                    </div>
                )}
                <DialogFooter className="flex !justify-between sm:gap-0 gap-2">
                    <Button onClick={resetModal}>الغاء</Button>
                    <Button
                        className="!px-10"
                        onClick={e => {
                            const finalCategories = selectedCategories;
                            resetModal();
                            onCategorySelect(finalCategories);
                        }}
                        gradient
                    >
                        تأكيد
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
