"use client";
import Button from "@/components/common/buttons/button";
import toast from "react-hot-toast";
import joinEventAction from "@/proxy/event/join-event-action";
import { useState } from "react";
import { motion } from "framer-motion";
import LogoLoading from "@/components/common/logo-loading";
import requestToJoinEventAction from "@/proxy/event/request-to-join-event-action";

export default function JoinButton({
    eventId,
    isEventPublic,
    children,
}: {
    eventId: string;
    isEventPublic: boolean;
    children?: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const getErrorMessage: () => string = () => {
        switch (error) {
            case "GENDER":
                return "الجنس غير مطابق للفعالية";
            case "JOINED":
                return "تم الانضمام مسبقاً";
            case "CREATOR":
                return "لا يمكنك الانضمام لفعالية قمت بإنشائها";
            case "REQUESTED":
                return "لقد قمت بإرسال طلب انضمام مسبقاً";
            default:
                return "حدث خطأ ما، الرجاء المحاولة مرة أخرى";
        }
    };

    const joinEvent = async () => {
        setIsLoading(true);
        const res = await joinEventAction(eventId);
        if (res) {
            setError(res.error);
            setIsLoading(false);
            return;
        }
        toast.success("تم الانضمام للفعالية");
    };

    const sendRequestToJoinEvent = async () => {
      setIsLoading(true);
        const res = await requestToJoinEventAction(eventId);
        if (res) {
            setError(res.error);
            setIsLoading(false);
            return;
        }
        toast.success("تم ارسال طلب الانضمام للفعالية");
    }


    return (
        <div className="grid place-items-center">
            {error && (
                <motion.p layout className="text-red-500 text-lg">
                    {getErrorMessage()}
                </motion.p>
            )}
            {!isLoading ? (
                <div className="w-full flex justify-end mt-5">
                    <Button
                        onClick={async () => {
                            if (isEventPublic) {
                              joinEvent();
                              return
                            }
                            sendRequestToJoinEvent()
                        }}
                        gradient
                        className="relative z-10"
                    >
                        {isEventPublic ? (
                            <>الانضمام للفعالية</>
                        ) : (
                            <>طلب الانضمام للفعالية</>
                        )}
                    </Button>
                </div>
            ) : (
                <LogoLoading className="w-20" />
            )}
            {children}
        </div>
    );
}
