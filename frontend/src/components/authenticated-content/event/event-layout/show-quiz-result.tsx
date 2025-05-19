"use client";
import React from "react";
import { useState } from "react";

import { motion } from "framer-motion";
import { Input } from "@/components/common/shadcn-ui/input";

import Button from "@/components/common/buttons/button";
import submitAssignmentAction from "@/proxy/assignments/submit-assignment-action";

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
  result: any;
};

export default function showQuizResult({ result }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = result.questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < result.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
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
        {result.questions.map((_: any, index: any) => (
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

      {/* {currentQuestion.questionType === "MULTIPLE_CHOICE" ? (
        <div className="flex flex-col gap-4">
          {result.TakeQuiz.answers[currentIndex].answer}
         
        </div>
      ) : (
        <Input
          value={answers[currentIndex].answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          className="w-full focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm placeholder:text-gray-400"
        />
      )} */}

      <div className="flex flex-col gap-4">
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
          <p className="text-gray-700 font-semibold mb-1">إجابتك:</p>
          <p className="text-black">
            {result.TakeQuiz.answers[currentIndex].answer}
          </p>
        </div>

        <div className="bg-green-100 border border-green-400 rounded-xl p-4">
          <p className="text-green-700 font-semibold mb-1">الإجابة الصحيحة:</p>
          <p className="text-black">{currentQuestion.correctAnswer}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={handleBack} disabled={currentIndex === 0}>
          السابق
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === result.questions.length - 1}
        >
          {"التالي"}
        </Button>
      </div>
    </div>
  );
}
