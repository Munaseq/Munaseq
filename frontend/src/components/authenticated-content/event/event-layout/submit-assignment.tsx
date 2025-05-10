"use client";
import React from "react";
import { useState } from "react";

import { motion } from "framer-motion";
import { Input } from "@/components/common/shadcn-ui/input";

import Button from "@/components/common/buttons/button";
import submitAssignmentAction from "@/proxy/assignments/submit-assignment-action";
type Assignment = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  questions: {
    text: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
  }[];
};

// const assignment: Assignment = {
//   id: "1",
//   state: "NotSubmitted",
//   endDate: "2025-10-10",
//   startDate: "2025-10-01",
//   questions: [
//     {
//       text: "What is the capital of Egypt?",
//       questionType: "multiple-choice",
//       options: ["Cairo", "Alexandria", "Giza", "Luxor"],
//       correctAnswer: "Cairo",
//     },
//   ],
// };

const MCS = ["أ", "ب", "ج", "د"];

type Question = {
  text: string;
  questionType: "multiple-choice" | "essay";
  options?: string[];
};

type Answer = {
  questionTitle: string;
  answer: string;
};

type Props = {
  questions: any[];
  assignmentId: string;
  eventId: string;
};

export default function TakeAssignment({
  questions,
  assignmentId,
  eventId,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => ({ questionTitle: q.text, answer: "" }))
  );

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (newAnswer: string) => {
    const updated = [...answers];
    updated[currentIndex].answer = newAnswer;
    setAnswers(updated);
  };

  async function handleSubmit(): Promise<void> {

    const answersToSubmit = {
      answers: answers,
    };

    const error = await submitAssignmentAction(
      assignmentId,
      eventId,
      answersToSubmit
    );
    if (error !== undefined && error !== null) {
      console.error("Error creating activity:", error);
    }
  }

  const handleNextAndSubmit = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-4">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`bg-white w-16 h-16 shadow-lg flex items-center justify-center cursor-pointer rounded-2xl hover:bg-custom-gradient transition-all hover:text-white ${
              currentIndex === index ? "bg-custom-gradient text-white" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="text-xl font-bold text-custom-black">
        السؤال {currentIndex + 1} : {currentQuestion.text}
      </div>

      {currentQuestion.questionType === "MULTIPLE_CHOICE" ? (
        <div className="flex flex-col gap-4">
          {currentQuestion.options?.map((option: any, index: any) => (
            <label
              key={index}
              className={`border rounded-lg px-4 py-2 cursor-pointer ${
                answers[currentIndex].answer === option
                  ? "bg-custom-light-purple text-white"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={option}
                checked={answers[currentIndex].answer === option}
                onChange={() => handleAnswerChange(option)}
                className="hidden"
              />
              {MCS[index]}. {option}
            </label>
          ))}
        </div>
      ) : (
        <Input
          value={answers[currentIndex].answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          className="w-full focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm placeholder:text-gray-400"
        />
      )}

      <div className="flex justify-between">
        <Button onClick={handleBack} disabled={currentIndex === 0}>
          السابق
        </Button>
        <Button onClick={handleNextAndSubmit}>
          {currentIndex === questions.length - 1 ? "تسليم الواجب" : "التالي"}
        </Button>
      </div>
    </div>
  );
}
