import React from "react";
import Image from "next/image";
import Link from "next/link";

import fileIcon from "@/assets/icons/calender.svg";

import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";

type Assignments = {
  id: string;
  endDate: string;
  startDate: string;
  questions: [
    {
      text: string;
      questionType: {};
      options: {};
      correctAnswer: string;
    }
  ];
};

type Quizes = {
  id: string;
  endDate: string;
  startDate: string;
  timeLimit: number;
  questions: [
    {
      text: string;
      questionType: {};
      options: {};
      correctAnswer: string;
    }
  ];
};

const assignments: Assignments[] = [
  {
    id: "1",
    endDate: "2021-10-10",
    startDate: "2021-10-10",
    questions: [
      {
        text: "What is the capital of Egypt?",
        questionType: {},
        options: {},
        correctAnswer: "Cairo",
      },
    ],
  },
];

const quizes: Quizes[] = [
  {
    id: "1",
    endDate: "2021-10-10",
    startDate: "2021-10-10",
    timeLimit: 10,
    questions: [
      {
        text: "What is the capital of Egypt?",
        questionType: {},
        options: {},
        correctAnswer: "Cairo",
      },
    ],
  },
];

export default async function ActivitiesPage({
  params,
}: {
  params: { eventId: string };
}) {
  // const assignments: Assignments[] = await getAssignmentAction(params.eventId);

  const cookiesStore = cookies();
  const token = cookiesStore.get("token");
  if (!token) {
    redirect("/signin");
  }
  const loggedUser: UserDataDto = await getProfileAction();
  const isPresenter: boolean = await isEventPresenterAction(
    params.eventId,
    loggedUser.username
  );
  return (
    <>
      <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
        <Image className="sm:w-12 w-10" src={fileIcon} alt="material icon" />
        أنشطة الفعالية
      </h1>
      <div className="flex flex-wrap gap-4 mt-10">
        {assignments.length === 0 && !isPresenter && (
          <p className="p-2 text-custom-gray">لا يوجد محتوى للفعالية</p>
        )}
        {assignments.map((assignment) => (
          <Link
            key={assignment.id}
            href={" "}
            target="_blank"
            className="p-2 bg-white rounded-lg shadow-strong grid place-items-center gap-2 w-56 aspect-square hover:shadow-md hover:scale-105 transition-all"
          >
            <div className="gri place-items-center text-center">
              <Image src={fileIcon} alt="file icon" className="w-10" />
              <div>
                <p className="font-semibold text-lg text-center">واجب</p>
                <p className="text-custom-gray text-sm">
                  {assignment.startDate} - {assignment.endDate}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {quizes.map((quiz) => (
          <Link
            key={quiz.id}
            href={" "}
            target="_blank"
            className="p-2 bg-white rounded-lg shadow-strong grid place-items-center gap-2 w-56 aspect-square hover:shadow-md hover:scale-105 transition-all"
          >
            <div className="gri place-items-center text-center">
              <Image src={fileIcon} alt="file icon" className="w-10" />
              <div>
                <p className="font-semibold text-lg text-center">اختبار</p>
                <p className="text-custom-gray text-sm">
                  {quiz.startDate} - {quiz.endDate}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {isPresenter && (
          <Link href={`/event/${params.eventId}/activities/create-activity`}>
            <div className="border-4 border-[#949494] border-dashed w-56 aspect-square rounded-3xl grid place-items-center transition-colors group hover:border-[#666666] cursor-pointer">
              <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p className="text-lg">أضف نشاط</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
