"use client";

import React, { useState } from "react";
import { Input } from "@/components/common/shadcn-ui/input";
import AddQuestion from "@/components/authenticated-content/event/event-layout/add-question";
import Button from "@/components/common/buttons/button";
import { FileQuestion, StarsIcon } from "lucide-react";
import { FileChartColumnIncreasing } from "lucide-react";
import { motion } from "framer-motion";
import createAssignmentAction from "@/proxy/assignments/create-assignment-action";
import createQuizAction from "@/proxy/quizzes/create-quiz-action";
import AIActivityDialog from "@/components/authenticated-content/event/event-layout/ai-activity-dialog";

type Question = {
    text: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
};

type Activity = {
    activityTitle: any;
    activityType: any;
    activityTimeLimit: any;
    startDate: any;
    endDate: any;
    questions: Question[];
};

export default function CreateActivityPage(params: {
    params: { eventId: string };
}) {
    const { eventId } = params.params;
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState<Activity>({
        activityType: "Assignment",
        activityTitle: "",
        activityTimeLimit: 0,
        startDate: today,
        endDate: today,
        questions: [],
    });

    const [endDateMin, setEndDateMin] = useState(today);
    const [showQuestion, setShowQuestion] = useState(false);
    const [questionNum, setQuestionNum] = useState<number>(0);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddQuestionFromAI = (
        questions: {
            question: string;
            answer: number;
            choices: string[];
        }[]
    ) => {
        setFormData(prev => {
            const newQuestions = [...prev.questions];
            questions.forEach(q => {
                newQuestions.push({
                    text: q.question,
                    questionType: "MULTIPLE_CHOICE",
                    options: q.choices,
                    correctAnswer: q.choices[q.answer],
                });
            });
            return { ...prev, questions: newQuestions };
        });
    };

    const handleAddQuestion = (index: number) => {
        setShowQuestion(true);
        setQuestionNum(index);
        setFormData(prev => {
            const newQuestions = [...prev.questions];

            if (index === newQuestions.length) {
                newQuestions.push({
                    text: "",
                    questionType: "MULTIPLE_CHOICE",
                    options: ["", ""],
                    correctAnswer: "",
                });
            }

            return { ...prev, questions: newQuestions };
        });
    };

    const handleQuestionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionNum ? { ...q, [name]: value } : q
            ),
        }));
    };

    const handleAddOption = () => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionNum ? { ...q, options: [...q.options, ""] } : q
            ),
        }));
    };

    const handleOptionChange = (
        optionIndex: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionNum
                    ? {
                          ...q,
                          options: q.options.map((opt, idx) =>
                              idx === optionIndex ? e.target.value : opt
                          ),
                      }
                    : q
            ),
        }));
    };

    const handleRemoveOption = () => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionNum
                    ? { ...q, options: q.options.slice(0, -1) }
                    : q
            ),
        }));
    };

    const handleRemoveQuestion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
        setShowQuestion(false);
        setQuestionNum(0);
    };

    const handleSaveActivity = async () => {

        if (formData.activityType === "Assignment") {
            const { activityTimeLimit, activityTitle, activityType, ...rest } =
                formData;

            const assignmentData = {
                ...rest,
                assignmentTitle: activityTitle,
            };
            const error = await createAssignmentAction(eventId, assignmentData);
            if (error !== undefined && error !== null) {
                console.error("Error creating activity:", error);
            }
        }

        if (formData.activityType === "Quiz") {
            const { activityTimeLimit, activityTitle, activityType, ...rest } =
                formData;

            const quizData = {
                ...rest,
                quizTitle: activityTitle,
                timeLimit: parseInt(activityTimeLimit),
            };

            const error = await createQuizAction(eventId, quizData);
            if (error !== undefined && error !== null) {
                console.error("Error creating activity:", error);
            }
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    };

    const questionCardVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: i * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        }),
    };

    return (
        <>
            <motion.h1
                className="font-bold flex items-center text-3xl gap-2 mt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FileChartColumnIncreasing
                    className="text-custom-light-purple"
                    size={40}
                />
                إضافة نشاط
            </motion.h1>

            <form className="my-10" onSubmit={e => e.preventDefault()}>
                {!showQuestion && (
                    <motion.div
                        className="flex flex-col gap-8 mb-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="flex gap-24 items-center"
                            variants={itemVariants}
                        >
                            <div className="flex gap-4 items-center">
                                <label
                                    htmlFor="activityTitle"
                                    className="block text-lg text-custom-gray"
                                >
                                    عنوان النشاط
                                </label>
                                <Input
                                    type="text"
                                    name="activityTitle"
                                    value={formData.activityTitle}
                                    onChange={handleChange}
                                    className="w-80 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
                                    placeholder="أدخل عنوان النشاط"
                                />
                                <label className="block text-lg text-custom-gray">
                                    نوع النشاط
                                </label>
                                <select
                                    name="activityType"
                                    value={formData.activityType}
                                    onChange={handleChange}
                                    className="cursor-pointer text-lg hover:text-custom-light-purple bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all"
                                >
                                    <option value="Assignment">واجب</option>
                                    <option value="Quiz">اختبار</option>
                                </select>
                            </div>

                            {formData.activityType === "Quiz" && (
                                <motion.div
                                    className="flex gap-4 items-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 24,
                                    }}
                                >
                                    <label
                                        htmlFor="activityTimeLimit"
                                        className="block text-lg text-custom-gray"
                                    >
                                        مدة الاختبار
                                    </label>
                                    <Input
                                        type="number"
                                        name="activityTimeLimit"
                                        value={formData.activityTimeLimit}
                                        onChange={handleChange}
                                        className="w-20 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                        <motion.div
                            className="flex gap-24 items-center"
                            variants={itemVariants}
                        >
                            <div className="flex gap-4 flex-col">
                                <label
                                    htmlFor="startDate"
                                    className="block text-lg text-custom-gray text-nowrap"
                                >
                                    تاريخ البدء
                                </label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    min={today}
                                    value={formData.startDate}
                                    onChange={e => {
                                        const newDate = e.target.value;
                                        setEndDateMin(newDate);
                                        setFormData(prev => ({
                                            ...prev,
                                            startDate: newDate,
                                            endDate: newDate,
                                        }));
                                    }}
                                    className="w-min cursor-pointer px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
                                />
                            </div>

                            <div className="flex gap-4 flex-col">
                                <label
                                    htmlFor="endDate"
                                    className="block text-lg text-custom-gray text-nowrap"
                                >
                                    تاريخ الانتهاء
                                </label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    min={endDateMin}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-min cursor-pointer px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex gap-24 items-center"
                            variants={itemVariants}
                        >
                            <AIActivityDialog
                                eventId={eventId}
                                onQuestionSubmit={handleAddQuestionFromAI}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {!showQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.h2
                            className="font-bold flex items-center text-xl gap-2 mt-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <FileQuestion
                                className="text-custom-light-purple"
                                size={30}
                            />
                            الأسئلة
                        </motion.h2>

                        <div className="flex flex-wrap gap-4 mt-4">
                            {formData.questions.map((_, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={questionCardVariants}
                                    className="bg-white w-16 h-16 shadow-lg flex items-center justify-center cursor-pointer rounded-2xl transition-all hover:bg-gray-100"
                                    onClick={() => handleAddQuestion(index)}
                                >
                                    {index + 1}
                                </motion.div>
                            ))}

                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    borderColor: "#666666",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-[#949494] border-dashed w-16 aspect-square rounded-2xl grid place-items-center cursor-pointer"
                                onClick={() =>
                                    handleAddQuestion(formData.questions.length)
                                }
                            >
                                <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>

                        {formData.questions.length > 0 && (
                            <motion.div
                                className="flex justify-center mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, type: "spring" }}
                            >
                                <Button gradient onClick={handleSaveActivity}>
                                    حفظ النشاط
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {showQuestion && (
                    <AddQuestion
                        formData={formData}
                        questionNum={questionNum}
                        handleChange={handleQuestionChange}
                        handleAddQuestion={handleAddQuestion}
                        handleAddOption={handleAddOption}
                        handleRemoveOption={handleRemoveOption}
                        handleOptionChange={handleOptionChange}
                        showQuestion={showQuestion}
                        handleShowQuestion={() => setShowQuestion(false)}
                        handleRemoveQuestion={handleRemoveQuestion}
                    />
                )}
            </form>
        </>
    );
}
