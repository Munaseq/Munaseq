import SmallCard from "@/components/common/cards/small-card";
import getDate from "@/util/get-date";
import getEventsAction from "@/proxy/event/get-events-action";
import { EventDataDto } from "@/dtos/event-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import Subtitle from "@/components/common/text/subtitle";
import Category from "@/components/common/category";

export default async function HighestRatedEvents() {
    const user: UserDataDto = await getProfileAction();

    return (
        <>
            {user.categories.map(async (category, index) => {
                const eventList: EventDataDto[] = await getEventsAction({
                    pageSize: 3,
                    highestRated: true,
                    category: category,
                });
                
                return (
                    <div className="mt-5" key={index}>
                        <Subtitle>
                            <div className="flex gap-2 items-center">

                            من فئة <Category notAnimate>{category}</Category>
                            </div>
                        </Subtitle>
                        {eventList?.length === 0 && (
                            <div className="mt-5 text-custom-gray">
                                لا يوجد فعاليات من فئة {category}
                            </div>
                        )}
                        <div className="flex mt-4 gap-8 flex-wrap lg:justify-start justify-center">
                            {eventList?.map((event: EventDataDto) => (
                                <SmallCard
                                    key={event.id}
                                    image={event.imageUrl}
                                    title={event.title}
                                    date={getDate(event.startDateTime)}
                                    eventCreator={event.eventCreator}
                                    eventId={event.id}
                                    badges={event.categories}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
