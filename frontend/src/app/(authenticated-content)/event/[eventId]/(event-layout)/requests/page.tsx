import { Status } from "@/components/authenticated-content/invites/inbox";
import ActionButtons from "@/components/authenticated-content/invites/invite-action-buttons";
import Subtitle from "@/components/common/text/subtitle";
import getEventRequestsAction from "@/proxy/event/get-event-requests.action";
import { CircleUserRoundIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export enum EventRequestType {
    ROLE_REQUEST = "ROLE_REQUEST",
    EVENT_REQUEST = "EVENT_REQUEST",
}

enum RequestRole {
    PRESENTER = "PRESENTER",
    MODERATOR = "MODERATOR",
}

export type EventRequest = {
    id: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
    requestType: "EVENT_REQUEST";
    roleType: RequestRole;
    Sender: {
        id: string;
        firstName: string;
        lastName: string;
        gender?: string;
        profilePictureUrl: string;
    };
};

export default async function RequestsPage({
    params,
}: {
    params: { eventId: string };
}) {
    const requests = await getEventRequestsAction(params.eventId);
    if (!requests) {
        redirect(`/event/${params.eventId}/about`);
    }
    return (
        <div>
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <MailIcon className="text-custom-light-purple" size={32} />
                طلبات الانضمام للفعالية
            </h1>
            {requests.length === 0 ? (
                <p className="p-2 text-custom-gray">لا توجد طلبات انضمام</p>
            ) : (
                <>
                    <Subtitle>
                        <div className="flex gap-1 items-center">
                            <span>طلبات الانضمام الواردة</span>
                        </div>
                    </Subtitle>
                    <div className="flex flex-col pt-4 gap-5">
                        {requests.map(
                            async (request: EventRequest, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between flex-row gap-2"
                                    >
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 aspect-square relative rounded-full overflow-hidden">
                                                {request.Sender
                                                    .profilePictureUrl ? (
                                                    <Image
                                                        src={
                                                            request.Sender
                                                                .profilePictureUrl
                                                        }
                                                        priority
                                                        fill
                                                        sizes="100%"
                                                        className="object-cover"
                                                        alt="User profile picture"
                                                    />
                                                ) : (
                                                    <CircleUserRoundIcon className="w-full h-full aspect-square" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden max-w-40">
                                                <p className="text-sm font-semibold">
                                                    من: {request.Sender.firstName}{" "}
                                                    {request.Sender.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(
                                                        request.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    طلب الانضمام للفعالية
                                                </p>
                                            </div>
                                        </div>
                                        <ActionButtons
                                            id={request.id}
                                            status={request.status}
                                            isSent={false}
                                            eventId={params.eventId}
                                            isInvite={false}
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
