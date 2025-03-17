import React from "react";

import Link from "next/link";

import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";

import { CalendarDays } from "lucide-react";

import { CircleHelp } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { Clock4 } from "lucide-react";
import { FileChartColumnIncreasing } from "lucide-react";
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
  const today = new Date().toISOString().split("T")[0];
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
        <FileChartColumnIncreasing
          className="text-custom-light-purple"
          size={40}
        />
        أنشطة الفعالية
      </h1>
      <div className="flex flex-wrap gap-4 mt-10">
        {assignments.length === 0 && !isPresenter && (
          <p className="p-2 text-custom-gray">لا يوجد محتوى للفعالية</p>
        )}
        {assignments.map((assignment) => (
          <Link
            key={assignment.id}
            // For presenter the link should be to the view assignment page
            // For student the link should be to the submit assignment page
            href={" "}
            target="_blank"
            className="bg-white rounded-xl p-4 shadow-strong w-48 h-48 aspect-square hover:shadow-md hover:scale-105 transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-custom-black text-2xl font-bold">واجب</h2>
            </div>
            <div className="flex items-center gap-2 text-custom-gray">
              <CalendarDays />
              <p>ينتهي: {assignment.endDate}</p>
            </div>

            {assignment.endDate < today && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <CircleHelp />
                <p>انتهت فترة الإجابة</p>
              </div>
            )}
          </Link>
        ))}
        {quizes.map((quiz) => (
          <Link
            key={quiz.id}
            // For presenter the link should be to the view assignment page
            // For student the link should be to the submit assignment page
            href={" "}
            target="_blank"
            className="bg-white rounded-xl p-4 shadow-strong w-48 h-48 aspect-square hover:shadow-md hover:scale-105 transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-custom-black text-2xl font-bold">اختبار</h2>
            </div>
            <div className="flex items-center gap-2 text-custom-gray">
              <CalendarDays />
              <p>ينتهي: {quiz.endDate}</p>
            </div>
            <div className="flex items-center gap-2 text-custom-gray mt-2">
              <Clock4 />
              <p>{quiz.timeLimit} دقيقة</p>
            </div>

            {quiz.endDate < today && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <CircleHelp />
                <p>انتهت فترة الإجابة</p>
              </div>
            )}
          </Link>
        ))}

        {isPresenter && (
          <Link href={`/event/${params.eventId}/activities/create-activity`}>
            <div className="border-4 border-[#949494] border-dashed w-48 aspect-square rounded-3xl grid place-items-center transition-colors group hover:border-[#666666] cursor-pointer">
              <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray ">
                <CirclePlus size={40} />
                <p className="text-lg mt-2">أضف نشاط</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
