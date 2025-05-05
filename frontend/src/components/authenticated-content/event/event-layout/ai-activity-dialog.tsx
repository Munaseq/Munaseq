"use client";

import Button from "@/components/common/buttons/button";
import LogoLoading from "@/components/common/logo-loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import TextArea from "@/components/common/text/text-area";
import { EventDataDto } from "@/dtos/event-data.dto";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import { getActivityFromAi } from "@/proxy/get-activity-from-ai";
import { CircleHelpIcon, StarsIcon } from "lucide-react";
import { useState } from "react";

type Questions = {
    question: string;
    answer: number;
    choices: string[];
};

export default function AIActivityDialog({ eventId, onQuestionSubmit }: { eventId: string, onQuestionSubmit: (questions: Questions[]) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [extraInstructions, setExtraInstructions] = useState("");
    const [result, setResult] = useState<Questions[]>([]);

    const handleGetQuestionFromAi = async () => {
        setIsLoading(true);
        setError("");

        const event: EventDataDto = await getEventAction(eventId);
        if (!event) {
            setError("حدث خطأ ما, يرجى المحاولة لاحقًا.");
            setIsLoading(false);
            return;
        }

        const genratedQuestions: any[] = await getActivityFromAi({
            title: event.title,
            description: event.description,
            extraInstructions: extraInstructions,
        });

        if (genratedQuestions.length === 0) {
            setError("حدث خطأ ما, يرجى المحاولة لاحقًا.");
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setResult(genratedQuestions);
    };
    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setIsOpen(prv => !prv);
                setError("");
                setExtraInstructions("");
                setResult([]);
                setIsLoading(false);
            }}
        >
            <DialogTrigger>
                <div className="px-4 h-10 bg-[length:120%] hover:bg-right transition-all bg-gradient-to-l from-custom-dark-purple to-custom-light-purple rounded-full text-white font-semibold flex items-center gap-2 text-nowrap ">
                    توليد اسئلة
                    <StarsIcon />
                </div>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>
                        ولد اسئلة باستخدام الذكاء الاصطناعي
                    </DialogTitle>
                    <DialogDescription>
                        سيتم انشاء مجموعة اسئلة عن طريق الذكاء الاصطناعي من
                        معلومات الفعالية
                    </DialogDescription>
                    {!isLoading && result.length === 0 ? (
                        <>
                            <div className="!my-2 !mt-4">
                                <TextArea
                                    value={extraInstructions}
                                    onChange={e =>
                                        setExtraInstructions(e.target.value)
                                    }
                                    className="!resize-y"
                                    placeholder="هل لديك تعليمات اضافية ؟"
                                    name="extra_instructions"
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mt-2">
                                    {error}
                                </p>
                            )}
                            <DialogFooter className="flex !justify-between gap-2">
                                <Button
                                    onClick={() => {
                                        setError("");
                                        setExtraInstructions("");
                                        setResult([]);
                                        setIsOpen(false);
                                        setIsLoading(false);
                                    }}
                                >
                                    الغاء
                                </Button>
                                <Button
                                    className="!flex gap-2 justify-center"
                                    gradient
                                    onClick={handleGetQuestionFromAi}
                                >
                                    انشاء
                                    <StarsIcon />
                                </Button>
                            </DialogFooter>
                        </>
                    ) : result.length > 0 ? (
                        // here show the result before confirming it
                        <div className="grid gap-2 mt-4 ">
                            <div className="max-h-96 overflow-y-auto px-5">
                                {result.map((question, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col mt-5"
                                    >
                                        <p className="text-lg font-semibold flex gap-2 items-center ">
                                            <CircleHelpIcon />
                                            السؤال {index + 1}
                                        </p>
                                        <div className="h-[1px] w-full bg-gray-300 my-2" />
                                        <p className="text-lg font-semibold">
                                            {question.question}
                                        </p>

                                        <p className="font-bold my-2">
                                            الخيارات
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            {question.choices.map(
                                                (choice, i) => (
                                                    <p
                                                        key={i}
                                                        className="text-sm"
                                                    >
                                                        {i + 1} - {choice}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                        <p className="font-bold my-2 text-green-800">
                                            الاجابة الصحيحة:{" "}
                                            {
                                                question.choices[
                                                    question.answer
                                                ]
                                            }
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <DialogFooter className="flex !justify-between gap-2">
                                <Button
                                    onClick={() => {
                                        setError("");
                                        setExtraInstructions("");
                                        setResult([]);
                                        setIsOpen(false);
                                    }}
                                >
                                    الغاء
                                </Button>
                                <Button
                                    className="!flex gap-2 justify-center"
                                    gradient
                                    onClick={() => {
                                        let questions: Questions[] = result
                                        setError("");
                                        setExtraInstructions("");
                                        setResult([]);
                                        setIsOpen(false);
                                        onQuestionSubmit(questions);
                                    }}
                                >
                                    تأكيد
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="grid place-items-center">
                            <div className="w-20">
                                <LogoLoading />
                            </div>
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
