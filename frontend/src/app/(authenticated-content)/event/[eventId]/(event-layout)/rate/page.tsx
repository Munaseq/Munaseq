"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import rateEventAction from "@/proxy/event/add-rate-event-action";
import { StarIcon } from "lucide-react";

export default function RatePage({ params }: { params: { eventId: string } }) {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRating = (value: number) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (!rating) {
            setMessage("الرجاء اختيار تقييم قبل الإرسال.");
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            
            const data = await rateEventAction(params.eventId, rating); // Call the backend action
            setMessage("تم إرسال تقييمك بنجاح.");
        } catch (error: any) {
            console.error("Error during submission:", error);

            // Set Arabic error messages based on potential error types
            const errorMessage = error.message;

            switch (errorMessage) {
                case "Unauthorized: User is not signed in.":
                    setMessage("يجب تسجيل الدخول لتتمكن من إرسال تقييم.");
                    break;
                case "Unauthorized":
                    setMessage("غير مصرح لك بتقييم هذه الفعالية.");
                    break;
                case "Failed to submit the rating.":
                    setMessage(
                        "حدث خطأ أثناء إرسال التقييم. الرجاء المحاولة لاحقاً."
                    );
                    break;
                default:
                    setMessage("حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.");
                    break;
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="">
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <StarIcon className="text-custom-light-purple" size={32} />
                شاركنا رأيك بالفعالية
            </h1>
            <div className="py-10 flex items-center gap-4">
                <label className="block text-lg">تقييمك للفعالية:</label>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handleRating(index + 1)}
                            className="focus:outline-none"
                        >
                            {/* <Image
                                src={
                                    index < rating
                                        ? ratingFilledIcon
                                        : ratingEmptyIcon
                                }
                                alt={`Star ${index + 1}`}
                                width={24}
                                height={24}
                            /> */}
                            <StarIcon
                            fill={index < rating ? "currentColor" : "none"}
                                className="text-custom-light-purple"
                                size={24}
                            />
                        </button>
                    ))}
                </div>
            </div>
            {message && (
                <p
                    className={`mt-2 ${
                        message.includes("خطأ")
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    {message}
                </p>
            )}
            <div className="mt-5">
                <Button gradient onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                </Button>
            </div>
        </div>
    );
}
