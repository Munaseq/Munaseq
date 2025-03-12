// import React from 'react'
// import Image from 'next/image'
// import Link from 'next/link'

// import fileIcon from '@/public/file-icon.svg'

// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import { UserDataDto } from '@/dtos/user-data.dto'

// type Assignments = {
//     id: string;
//     endDate: string;
//     startDate: string;
//     questions: [{
//         text: string;
//         questionType: {};
//         options: {};
//         correctAnswer: string
//     }];
// };

// type Quizes = {
//     id: string;
//     endDate: string;
//     startDate: string;
//     timeLimit: number;
//     questions: [{
//         text: string;
//         questionType: {};
//         options: {};
//         correctAnswer: string
//     }];

// };

// export default function Activitiespage({params}: {params: {eventId: string}}) {

//     const assignments: Assignments[] = await getAssignmentAction(params.eventId);

//     const cookiesStore = cookies();
//     const token = cookiesStore.get("token");
//     if (!token) {
//         redirect("/signin");
//     }
//     const loggedUser: UserDataDto = await getProfileAction();
//     const isPresenter: boolean = await isEventPresenterAction(
//         params.eventId,
//         loggedUser.username
//     );
//   return (
//     <>
//        <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
//                <Image
//                     className="sm:w-12 w-10"
//                     src={fileIcon}
//                     alt="material icon"
//                 />
//                 أنشطة الفعالية
//             </h1>
//             <div className="flex flex-wrap gap-4 mt-10">
//                 {assignments.length === 0 && !isPresenter && (
//                     <p className="p-2 text-custom-gray">
//                         لا يوجد محتوى للفعالية
//                     </p>
//                 )}
//                 {assignments.map(assignment => (
//                     <Link
//                         key={assignment.id}
//                         href={" "}
//                         target="_blank"
//                         className="p-2 bg-white rounded-lg shadow-strong grid place-items-center gap-2 w-56 aspect-square hover:shadow-md hover:scale-105 transition-all"
//                     >
//                         <div className="gri place-items-center text-center">
//                             <Image
//                                 src={fileIcon}
//                                 alt="file icon"
//                                 className="w-10"
//                             />
//                             <div>
//                                 <p className="font-semibold text-lg text-center">
//                                     واجب
//                                 </p>
//                                 <p className="text-custom-gray text-sm">
//                                     {assignment.startDate} - {assignment.endDate}
//                                 </p>
//                             </div>
//                         </div>
//                     </Link>
//                 ))}
//                 {isPresenter && <AddActivty eventId={params.eventId} />}
//             </div>
//     </>
//   )
// }
