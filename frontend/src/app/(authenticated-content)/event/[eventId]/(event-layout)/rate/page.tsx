import RateForm from "@/components/authenticated-content/event/event-layout/rate-form";
import { EventDataDto } from "@/dtos/event-data.dto";
import { UserDataDto } from "@/dtos/user-data.dto";
import getEventRateAction from "@/proxy/event/get-event-rate-action";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import getAllUsers from "@/proxy/user/get-all-user-event-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import { CalendarClockIcon, StarIcon } from "lucide-react";

export type Feedback = {
    comment: string;
    createdAt: string;
    rating: number;
    User: {
        id: string;
        username: string;
        profilePictureUrl: string;
        firstName: string;
        lastName: string;
        rating: number;
    };
};

export default async function RatePage({
    params,
}: {
    params: { eventId: string };
}) {
    const currentDate = new Date();
    const event: EventDataDto = await getEventAction(params.eventId);
    const didEventEnd = new Date(event.endDateTime) < currentDate;
    const currentUser: UserDataDto = await getProfileAction();
    const isEventCreator = currentUser.id === event.eventCreator.id;
    const rating: {
        avgRating: number;
        numberOfRatings: number;
        feedbacks: Feedback[];
    } = await getEventRateAction(params.eventId);

    let currentUserRating: Feedback | undefined = undefined;

    if (rating.feedbacks.length !== 0) {
        currentUserRating = rating.feedbacks.find(
            feedback => feedback.User.username === currentUser.username
        );
    }

    return (
        <div className="">
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <StarIcon className="text-custom-light-purple" size={32} />
                شاركنا رأيك بالفعالية
            </h1>
            {didEventEnd && !isEventCreator && (
                <RateForm
                    eventId={params.eventId}
                    currentUserRating={currentUserRating}
                />
            )}
            {!didEventEnd && !isEventCreator && (
                <div className="p-10 mt-10 grid place-items-center bg-black bg-opacity-50 rounded-3xl">
                    <p className="p-2 text-white text-xl grid place-items-center gap-2">
                        <CalendarClockIcon size={50} />
                        عد بعد انتهاء الفعالية حتى تتمكن من تقييمها و الحصول على
                        الشهادة
                    </p>
                </div>
            )}
            {isEventCreator && rating && (
                // display all ratings
                <>
                    {rating.feedbacks.length !== 0 && (
                        <div className="flex flex-col gap-4 mt-10">
                            <h2 className="font-bold text-2xl">
                                تقييمات الحضور
                            </h2>
                            <div className="flex items-center gap-2">
                                <StarIcon
                                    className="text-custom-light-purple"
                                    size={32}
                                />
                                <p className="text-lg font-semibold">
                                    {rating.avgRating}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ({rating.numberOfRatings} تقييم)
                                </p>
                            </div>
                            {rating.feedbacks.map(feedback => (
                                <div
                                    key={feedback.User.id}
                                    className="bg-white p-4 rounded-lg shadow-md"
                                >
                                    <div className="flex items-center mt-2">
                                        {Array.from(
                                            { length: feedback.rating },
                                            (_, index) => (
                                                <StarIcon
                                                    key={index}
                                                    className="text-custom-light-purple"
                                                    size={20}
                                                />
                                            )
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                feedback.User.profilePictureUrl
                                            }
                                            alt={`${feedback.User.firstName} ${feedback.User.lastName}`}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{`${feedback.User.firstName} ${feedback.User.lastName}`}</h3>
                                            <p className="text-lg text-gray-700">
                                                {feedback.comment}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    feedback.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    )}
                    {rating.feedbacks.length === 0 && (
                        <div className="p-10 mt-10 grid place-items-center">
                            <p className="p-2 text-black text-xl grid place-items-center gap-2">
                                لا يوجد تقييمات حتى الآن
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
