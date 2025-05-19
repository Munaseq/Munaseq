"use client";

import LogoLoading from "@/components/common/logo-loading";
import TooltipWrapper from "@/components/common/tooltip";
import responndToinvitationAction from "@/proxy/user/respond-to-Invitation";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Status } from "./inbox";
import { useRouter } from "next/navigation";
import respondToEventRequestAction from "@/proxy/event/respond-to-event-request";

export default function ActionButtons({
    id,
    senderUsername,
    status,
    isSent,
    eventId,
    isInvite
}: {
    id: string;
    senderUsername?: string;
    status: Status;
    isSent: boolean;
    eventId?: string;
    isInvite: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAcceptInvite = async () => {
        setLoading(true);
        toast.loading(`جاري قبول دعوة ${senderUsername}`, {
            id: "invite-accept",
        });
        const error = await responndToinvitationAction({
            invitationId: id,
            decision: true,
        });
        if (error) {
            toast.error("حدث خطأ أثناء قبول الدعوة", { id: "invite-accept" });
        } else {
            toast.success("تم قبول الدعوة بنجاح", { id: "invite-accept" });
            router.push(`/event/${eventId}`);
        }
        setLoading(false);
    };
    const handleRejectInvite = async () => {
        setLoading(true);
        toast.loading(`جاري رفض دعوة ${senderUsername}`, {
            id: "invite-reject",
        });
        const error = await responndToinvitationAction({
            invitationId: id,
            decision: false,
        });
        if (error) {
            toast.error("حدث خطأ أثناء رفض الدعوة", { id: "invite-reject" });
        } else {
            toast.success("تم رفض الدعوة بنجاح", { id: "invite-reject" });
        }
        setLoading(false);
    };

    const handleAcceptRequest = async () => {
        setLoading(true);
        toast.loading(`جاري قبول الطلب`, {
            id: "request-accept",
        });
        const error = await respondToEventRequestAction({
            requestId: id,
            decision: true,
        });
        if (error) {
            toast.error("حدث خطأ أثناء قبول الطلب", { id: "request-accept" });
        } else {
            toast.success("تم قبول الطلب بنجاح", { id: "request-accept" });
        }
        setLoading(false);
    }

    const handleRejectRequest = async () => {
        setLoading(true);
        toast.loading(`جاري رفض الطلب`, {
            id: "request-reject",
        });
        const error = await respondToEventRequestAction({
            requestId: id,
            decision: false,
        });
        if (error) {
            toast.error("حدث خطأ أثناء رفض الطلب", { id: "request-reject" });
        } else {
            toast.success("تم رفض الطلب بنجاح", { id: "request-reject" });
        }
        setLoading(false);

    }

    return (
        <div className="flex gap-2 justify-center items-center text-gray-500 pl-5">
            {!loading ? (
                <>
                    {status === Status.PENDING ? (
                        <>
                        {isSent ? (<div className="h-min grid place-items-center text-gray-500">
                            في انتظار رد
                        </div>) : (<>
                        <div className="h-min grid place-items-center">
                        <TooltipWrapper text="قبول">
                            <CheckCircle2Icon
                                onClick={isInvite ? handleAcceptInvite : handleAcceptRequest}
                                size={42}
                                strokeWidth={1}
                                className="hover:text-green-800"
                            />
                        </TooltipWrapper>
                    </div>
                    <div className="h-min grid place-items-center">
                        <TooltipWrapper text="رفض">
                            <XCircleIcon
                                onClick={isInvite ? handleRejectInvite : handleRejectRequest}
                                size={42}
                                strokeWidth={1}
                                className="hover:text-red-800"
                            />
                        </TooltipWrapper>
                    </div></>)
                            
                        }
                        </>
                    ) : status === Status.ACCEPTED ? (
                        <div className="h-min grid place-items-center text-green-800">
                            مقبولة
                        </div>
                    ) : status === Status.REJECTED ? (
                        <div className="h-min grid place-items-center text-red-800">
                            مرفوضة
                        </div>
                    ) : (
                        <div className="h-min grid place-items-center text-red-800">
                            تم الإلغاء  
                        </div>
                    )}
                </>
            ) : (
                <div className="grid place-items-center w-full">
                    <LogoLoading className="w-14 aspect-square" />
                </div>
            )}
        </div>
    );
}
