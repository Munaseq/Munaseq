// import React from "react";
// import LargeCard from "@/components/common/cards/large-card";
// import Image from "next/image";
// import titleEffect from "@/assets/land-assets/title-effect.svg";
// import getEventsAction from "@/proxy/event/get-events-action";
// import { EventDataDto } from "@/dtos/event-data.dto";
// import getUserAction from "@/proxy/user/get-user-using-id-action";
// import { UserDataDto } from "@/dtos/user-data.dto";
// import getUserRating from "@/proxy/user/get-user-rating-action";
// import getDate from "@/util/get-date";

// export default async function EventSection() {
//     const events: EventDataDto[] = await getEventsAction({ pageSize: 3 });
//     const eventsCardsReq = events.map(async event => {
//         const eventCreator: UserDataDto = await getUserAction(
//             event.eventCreatorId
//         );
//         const eventCreatorRating = await getUserRating(event.eventCreatorId);
//         return {
//             id: event.id,
//             title: event.title,
//             description: event.description,
//             image: event.imageUrl,
//             date: event.startDateTime,
//             location: event.location,
//             creatorName: eventCreator.firstName + " " + eventCreator.lastName,
//             creatorRating: eventCreatorRating,
//             badges: event.categories,
//         };
//     });
//     const eventInfo = await Promise.all(eventsCardsReq);
//     return (
//         <div id="events" className="container mx-auto px-4 py-24 relative">
//             <h1 className="text-custom-black text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center">
//                 فعاليات{" "}
//                 <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
//                     منسقين
//                 </span>{" "}
//                 المنصة
//             </h1>
//             <div className="absolute top-[1%] left-1/2 -translate-x-1/2 -z-10 hidden md:block">
//                 <Image src={titleEffect} alt="" />
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-20">
//                 {eventInfo.map(eventInfo => (
//                     <LargeCard
//                         id={eventInfo.id}
//                         key={eventInfo.id}
//                         image={eventInfo.image}
//                         title={eventInfo.title}
//                         description={eventInfo.description}
//                         date={getDate(eventInfo.date)}
//                         presenter={eventInfo.creatorName}
//                         rate={
//                             eventInfo.creatorRating.avgRating
//                                 ? eventInfo.creatorRating.avgRating
//                                 : 0
//                         }
//                         badges={eventInfo.badges}
//                     />
//                 ))}
//             </div>

//             <div className="w-fit mx-auto pt-20"></div>
//         </div>
//     );
// }
