"use client";

import React, { useState } from "react";
import Image from "next/image";
import fileIcon from "@/assets/icons/calender.svg";
import { Input } from "@/components/common/shadcn-ui/input";

type AddQuestionProps = {
  formData: any;
  questionNum: number;
  handleChange: any;
  handleAddQuestion: any;
};

const MCS = ["أ", "ب", "ج", "د"];

export default function AddQuestion({
  formData,
  questionNum,
  handleChange,
  handleAddQuestion,
}: AddQuestionProps) {
  const [numOfMcs, setNumOfMcs] = useState(4);
  return (
    <div>
      <h2 className="font-bold flex items-center text-2xl gap-2 mt-4">
        <Image className="sm:w-12 w-10" src={fileIcon} alt="material icon" />
        إضافة سؤال
      </h2>

      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center">
            <label htmlFor="questionType">نوع السؤال</label>
            <select
              name="questionType"
              onChange={handleChange}
              value={formData.questions[questionNum].questionType}
            >
              <option value="multiple-choice">اختيار من متعدد</option>
              <option value="essay">مقالي</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="numOfMcs">عدد الاختيارات</label>
            <select
              name="numOfMcs"
              value={numOfMcs}
              onChange={(e) => setNumOfMcs(Number(e.target.value))}
              defaultValue={"4"}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="question">السؤال</label>
          <Input
            type="text"
            name="text"
            onChange={handleChange}
            value={formData.questions[questionNum].text}
          />
        </div>

        {formData.questions[questionNum].questionType === "multiple-choice" &&
          Array.from({ length: numOfMcs }).map((_, index) => (
            <div key={index} className="flex">
              <label htmlFor="option">{MCS[index]}</label>
              <Input
                type="text"
                name="option"
                onChange={handleChange}
                value={formData.questions[questionNum].options[index]}
              />
            </div>
          ))}
        {formData.questions[questionNum].questionType === "multiple-choice" && (
          <div className="flex">
            <label htmlFor="correctAnswer">الاجابة الصحيحة</label>
            <select
              name="correctAnswer"
              onChange={handleChange}
              value={formData.questions[questionNum].correctAnswer}
            >
              {Array.from({ length: numOfMcs }).map((_, index) => (
                <option key={index} value={MCS[index]}>
                  {MCS[index]}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.questions[questionNum].questionType === "essay" && (
          <div className="flex">
            <label htmlFor="correctAnswer">الاجابة الصحيحة</label>
            <Input
              type="text"
              name="correctAnswer"
              onChange={handleChange}
              value={formData.questions[questionNum].correctAnswer}
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="bg-custom-light-purple text-white p-2 rounded-lg"
            onClick={() => handleAddQuestion(questionNum)}
          >
            اضافة
          </button>
        </div>
      </div>
    </div>
  );
}
