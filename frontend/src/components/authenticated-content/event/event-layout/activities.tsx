"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/common/buttons/button";
import {
  CalendarDays,
  CircleHelp,
  CirclePlus,
  Clock4,
  FileChartColumnIncreasing,
  ArrowLeft,
  LetterText,
} from "lucide-react";
import showAssignmentAction from "@/proxy/assignments/show-assignment-action";
import showQuizAction from "@/proxy/quizzes/show-quiz-action";
import deleteAssignmentAction from "@/proxy/assignments/delete-assignment-action";
import deleteQuizAction from "@/proxy/quizzes/delete-quiz-action";

type Assignments = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  questions: {
    text: string;
    questionType: {};
    options: {};
    correctAnswer: string;
  }[];
};

type Quizes = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  timeLimit: number;
  questions: {
    text: string;
    questionType: {};
    options: {};
    correctAnswer: string;
  }[];
};

// const assignments: Assignments[] = [
//   {
//     id: "1",
//     state: "NotSubmitted",
//     endDate: "2025-10-10",
//     startDate: "2025-10-01",
//     questions: [
//       {
//         text: "What is the capital of Egypt?",
//         questionType: {},
//         options: {},
//         correctAnswer: "Cairo",
//       },
//     ],
//   },
// ];

// const quizes: Quizes[] = [
//   {
//     id: "1",
//     state: "Submitted",
//     endDate: "2025-10-10",
//     startDate: "2025-10-01",
//     timeLimit: 10,
//     questions: [
//       {
//         text: "What is the capital of Egypt?",
//         questionType: {},
//         options: {},
//         correctAnswer: "Cairo",
//       },
//     ],
//   },
// ];

export default function Activities({
  eventId,
  isPresenter,
  assignments,
  quizzes,
}: {
  eventId: string;
  isPresenter: boolean;
  assignments: any[];
  quizzes: any[];
}) {
  const today = new Date().toISOString().split("T")[0];

  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activityType, setActivityType] = useState<
    "assignment" | "quiz" | null
  >(null);

  const handleBack = () => {
    setSelectedActivity(null);
    setActivityType(null);
  };

  const handleAssignmentClick = async (assignmentId: any): Promise<void> => {
    const selectedAssignment: any = await showAssignmentAction(assignmentId);
    setSelectedActivity(selectedAssignment);
    setActivityType("assignment");
  };

  const handleQuizClick = async (quizId: any): Promise<void> => {
    const selectedQuiz = await showQuizAction(quizId);
    setSelectedActivity(selectedQuiz);
    setActivityType("quiz");
  };

  const handleDeleteAssignment = async (assignmentId: any): Promise<void> => {
    const error = await deleteAssignmentAction(assignmentId, eventId);
    if (error !== undefined && error !== null) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: any): Promise<void> => {
    const error = await deleteQuizAction(quizId, eventId);
    if (error !== undefined && error !== null) {
      console.error("Error deleting activity:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <div>
      <motion.h1
        className="font-bold flex items-center text-3xl gap-2 mt-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FileChartColumnIncreasing
          className="text-custom-light-purple"
          size={40}
        />
        {selectedActivity === null
          ? "الأنشطة"
          : activityType === "assignment"
          ? "تفاصيل الواجب"
          : "تفاصيل الاختبار"}
      </motion.h1>

      {selectedActivity === null ? (
        <motion.div
          className="flex flex-wrap gap-4 mt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {!isPresenter && assignments.length === 0 && quizzes.length === 0 && (
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <p className="text-custom-gray text-lg">لا توجد أنشطة متاحة</p>
            </motion.div>
          )}
          {assignments.map(
            (assignment: any, index: any) =>
              assignment && (
                <motion.div
                  key={assignment.id}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleAssignmentClick(assignment.id);
                  }}
                  className="bg-white rounded-xl p-4 shadow-lg w-48 h-48 aspect-square cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-custom-black text-2xl font-bold">
                      واجب
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-custom-gray">
                    <CalendarDays size={18} />
                    <p>ينتهي: {assignment.endDate.split("T")[0]}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {assignment.startDate.split("T")[0] < today ? (
                      <>
                        <CircleHelp size={18} className="text-custom-gray" />
                        <p className="text-red-600 font-semibold">
                          انتهت فترة الإجابة
                        </p>
                      </>
                    ) : (
                      !isPresenter &&
                      (assignment.takeAssignmentStatus === "SUBMITTED" ? (
                        <>
                          <CircleHelp size={18} className="text-custom-gray" />
                          <p className="text-green-600 font-semibold">
                            تم التسليم
                          </p>
                        </>
                      ) : (
                        <>
                          <CircleHelp size={18} className="text-custom-gray" />
                          <p className="text-yellow-600 font-semibold">
                            لم يتم التسليم بعد
                          </p>
                        </>
                      ))
                    )}
                  </div>
                </motion.div>
              )
          )}

          {quizzes.map(
            (quiz: any, index: any) =>
              quiz && (
                <motion.div
                  key={quiz.id}
                  custom={index + assignments.length}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleQuizClick(quiz.id);
                  }}
                  className="bg-white rounded-xl p-4 shadow-lg w-48 h-48 aspect-square cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-custom-black text-2xl font-bold">
                      اختبار
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-custom-gray">
                    <CalendarDays size={18} />
                    <p>ينتهي: {quiz.endDate.split("T")[0]}</p>
                  </div>
                  <div className="flex items-center gap-2 text-custom-gray mt-2">
                    <Clock4 size={18} />
                    <p>{quiz.timeLimit} دقيقة</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {quiz.startDate.split("T")[0] < today ? (
                      <>
                        <CircleHelp size={18} className="text-custom-gray" />
                        <p className="text-red-600 font-semibold">
                          انتهت فترة الإجابة
                        </p>
                      </>
                    ) : (
                      !isPresenter &&
                      (quiz.takeQuizStatus === "SUBMITTED" ? (
                        <>
                          <CircleHelp size={18} className="text-custom-gray" />
                          <p className="text-green-600 font-semibold">
                            تم التسليم
                          </p>
                        </>
                      ) : (
                        <>
                          <CircleHelp size={18} className="text-custom-gray" />
                          <p className="text-yellow-600 font-semibold">
                            لم يتم التسليم بعد
                          </p>
                        </>
                      ))
                    )}
                  </div>
                </motion.div>
              )
          )}

          {isPresenter && (
            <motion.div
              custom={assignments.length + quizzes.length}
              variants={cardVariants}
              whileHover={{ scale: 1.05, borderColor: "#666666" }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#949494] border-dashed w-48 h-48 aspect-square rounded-2xl grid place-items-center cursor-pointer"
            >
              <Link
                href={`/event/${eventId}/activities/create-activity`}
                className="w-full h-full grid place-items-center"
              >
                <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray">
                  <CirclePlus size={40} />
                  <p className="text-lg mt-2">أضف نشاط</p>
                </div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <motion.div
            className="space-y-3 my-6 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="flex items-center gap-2 "
            >
              <LetterText size={16} className="text-custom-gray" />
              <span className="font-semibold"> عنوان النشاط:</span>{" "}
              {activityType === "assignment"
                ? selectedActivity.assignmentTitle
                : selectedActivity.quizTitle}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="flex items-center gap-2 "
            >
              <CalendarDays size={16} className="text-custom-gray" />
              <span className="font-semibold">تاريخ البدء:</span>{" "}
              {selectedActivity.startDate.split("T")[0]}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <CalendarDays size={16} className="text-custom-gray" />
              <span className="font-semibold">تاريخ الانتهاء:</span>{" "}
              {selectedActivity.endDate.split("T")[0]}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <CircleHelp size={16} className="text-custom-gray" />

              <span className="font-semibold">
                عدد الأسئلة: {selectedActivity.questions.length}
              </span>
            </motion.p>

            {activityType === "quiz" && "timeLimit" in selectedActivity && (
              <motion.p
                variants={itemVariants}
                className="flex items-center gap-2"
              >
                <Clock4 size={16} className="text-custom-gray" />
                <span className="font-semibold">المدة:</span>{" "}
                {selectedActivity.timeLimit} دقائق
              </motion.p>
            )}
          </motion.div>

          {activityType === "quiz" && !isPresenter && (
            <motion.div
              className="p-4 text-red-600 font-semibold mt-4 flex items-center gap-3 max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              عند مغادرة الصفحة، سيتم إرسال إجاباتك تلقائيًا ولن تتمكن من
              العودة!
            </motion.div>
          )}
        </motion.div>
      )}

      {selectedActivity && (
        <motion.div
          className="flex justify-between items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Button onClick={handleBack} className="flex items-center gap-2">
            عودة
          </Button>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {!isPresenter ? (
              <>
                <Link
                  href={`/event/${eventId}/activities/${activityType}/${selectedActivity.id}/submit-${activityType}`}
                >
                  <Button
                    disabled={selectedActivity.endDate.split("T")[0] < today}
                    gradient
                    className={
                      selectedActivity.endDate.split("T")[0] < today ||
                      selectedActivity.startDate.split("T")[0] > today ||
                      (activityType === "assignment" &&
                        selectedActivity.takeAssignmentStatus ===
                          "SUBMITTED") ||
                      (activityType === "quiz" &&
                        selectedActivity.takeQuizStatus === "SUBMITTED")
                        ? "hidden"
                        : ""
                    }
                  >
                    ابدأ النشاط
                  </Button>
                </Link>
                <Link
                  href={`/event/${eventId}/activities/${activityType}/${selectedActivity.id}/show-${activityType}-result`}
                >
                  <Button
                    disabled={
                      (activityType === "assignment" &&
                        selectedActivity.takeAssignmentStatus !==
                          "SUBMITTED") ||
                      (activityType === "quiz" &&
                        selectedActivity.takeQuizStatus !== "SUBMITTED")
                    }
                    gradient
                    className={
                      (activityType === "assignment" &&
                        selectedActivity.takeAssignmentStatus ===
                          "SUBMITTED") ||
                      (activityType === "quiz" &&
                        selectedActivity.takeQuizStatus === "SUBMITTED")
                        ? ""
                        : "hidden"
                    }
                  >
                    عرض النتيجة
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/event/${eventId}/activities/${activityType}/${selectedActivity.id}/update-${activityType}`}
                >
                  <Button
                    disabled={selectedActivity.startDate.split("T")[0] <= today}
                    gradient
                    className={
                      selectedActivity.startDate.split("T")[0] <= today
                        ? "hidden"
                        : ""
                    }
                  >
                    تعديل النشاط
                  </Button>
                </Link>

                <Button
                  onClick={
                    activityType === "assignment"
                      ? () => handleDeleteAssignment(selectedActivity.id)
                      : () => handleDeleteQuiz(selectedActivity.id)
                  }
                >
                  حذف النشاط
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
