"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/buttons/button";
import rateEventAction from "@/proxy/event/add-rate-event-action";
import { AwardIcon, StarIcon } from "lucide-react";
import { Feedback } from "@/app/(authenticated-content)/event/[eventId]/(event-layout)/rate/page";
import toast from "react-hot-toast";
import LogoLoading from "@/components/common/logo-loading";
import getCertificateAction from "@/proxy/event/get-certificate";

export default function RateForm({
    eventId,
    currentUserRating,
}: {
    eventId: string;
    currentUserRating: Feedback | undefined;
}) {
    const [changed, setChanged] = useState(false);
    const [rating, setRating] = useState(
        currentUserRating ? currentUserRating.rating : 0
    );
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<string>(
        currentUserRating ? currentUserRating.comment : ""
    );

    const handleRating = (value: number) => {
        setChanged(true);
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
            const data = await rateEventAction(eventId, rating, feedback); // Call the backend action
            setChanged(false);
            toast.success("تم إرسال التقييم بنجاح.");
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

    const handleGetCertificate = async () => {
        const certificate: { certificateUrl: string } | null =
            await getCertificateAction(eventId); // Call the backend action
        if (certificate) {
            // open the certificate URL in a new tab
            const newTab = window.open(certificate.certificateUrl, "_blank");
            if (newTab) {
                newTab.focus();
            }
            return
        }
        toast.error("حدث خطأ أثناء تحميل الشهادة. الرجاء المحاولة لاحقاً.");
        return;
    };

    return (
        <>
            <div className="py-10 flex items-center gap-4">
                <label className="block text-lg">تقييمك للفعالية:</label>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handleRating(index + 1)}
                            className="focus:outline-none"
                        >
                            <StarIcon
                                fill={index < rating ? "currentColor" : "none"}
                                className="text-custom-light-purple"
                                size={24}
                            />
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                للحصول على الشهادة، يجب عليك تقييم الفعالية.
            </p>
            {rating > 0 && (
                <div className="max-w-96">
                    <textarea
                        className="w-full h-24 p-2 border rounded-lg outline-none focus:ring-2 resize-none"
                        placeholder="تعليقك عن الفعالية"
                        onChange={e => {
                            setChanged(true);
                            setFeedback(e.target.value);
                        }}
                        value={feedback}
                    ></textarea>
                </div>
            )}
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
            {((rating > 0 && !currentUserRating) ||
                (changed && currentUserRating)) && (
                <div className="mt-5">
                    {!isSubmitting && (
                        <Button
                            gradient
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            إرسال التقييم
                        </Button>
                    )}
                    {isSubmitting && (
                        <div className="grid place-items-center w-full">
                            <LogoLoading className="w-20 aspect-square" />
                        </div>
                    )}
                </div>
            )}
            {currentUserRating && (
                <>
                    <h1 className="font-bold flex items-center text-3xl gap-2 my-4">
                        <AwardIcon
                            className="text-custom-light-purple"
                            size={32}
                        />
                        احصل على الشهادة
                    </h1>
                    <Button onClick={handleGetCertificate} gradient>
                        اضغط هنا لتحميل الشهادة
                    </Button>
                </>
            )}
        </>
    );
}
