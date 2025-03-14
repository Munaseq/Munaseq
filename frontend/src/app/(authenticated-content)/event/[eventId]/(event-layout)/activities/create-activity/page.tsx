"use client";

import React, { useState } from "react";
import Image from "next/image";
import fileIcon from "@/assets/icons/calender.svg";
import { Input } from "@/components/common/shadcn-ui/input";
import AddQuestion from "@/components/authenticated-content/event/event-layout/add-question";
import { set } from "date-fns";

type Question = {
  text: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
};

type Activity = {
  activityType: string;
  activityTimeLimit: number;
  startDate: string;
  endDate: string;
  questions: Question[];
};

export default function CreateActivityPage() {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<Activity>({
    activityType: "",
    activityTimeLimit: 0,
    startDate: today,
    endDate: today,
    questions: [{ text: "", questionType: "", options: [], correctAnswer: "" }],
  });

  const [endDateMin, setEndDateMin] = useState(today);

  const [showQuestion, setShowQuestion] = useState(false);
  const [questionNum, setQuestionNum] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = (index: number) => {
    setShowQuestion((prev) => !prev);
    setQuestionNum(index);
    if (index <= formData.questions.length) {
      setFormData((prev) => {
        return {
          ...prev,
          questions: [
            ...prev.questions,
            { text: "", questionType: "", options: [], correctAnswer: "" },
          ],
        };
      });
    }
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionNum] = {
        ...updatedQuestions[questionNum],
        [name]: value,
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  return (
    <>
      <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
        <Image className="sm:w-12 w-10" src={fileIcon} alt="material icon" />
        إضافة نشاط
      </h1>

      <form className="space-y-6">
        {!showQuestion && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label>نوع النشاط</label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
              >
                <option value="Assignment">واجب</option>
                <option value="Quiz">اختبار</option>
              </select>
            </div>

            {formData.activityType === "Quiz" && (
              <div className="flex justify-between items-center">
                <label htmlFor="activityTimeLimit"> مذة الاختبار</label>
                <Input
                  type="number"
                  name="activityTimeLimit"
                  value={formData.activityTimeLimit}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <label htmlFor="startDate">تاريخ البدء</label>
              <Input
                type="date"
                name="startDate"
                min={today}
                value={formData.startDate}
                onChange={(e) => {
                  handleChange(e);
                  setEndDateMin(e.target.value);
                  setFormData({ ...formData, endDate: e.target.value });
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="endDate">تاريخ الانتهاء</label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {!showQuestion && (
          <div>
            <h2 className="font-bold flex items-center text-2xl gap-2 mt-4">
              <Image
                className="sm:w-12 w-10"
                src={fileIcon}
                alt="material icon"
              />
              الأسئلة
            </h2>

            <div className="flex flex-wrap gap-2">
              {formData.questions.map((_, index) => (
                <div
                  key={index}
                  className="bg-white w-16 h-16 shadow-lg flex items-center justify-center"
                  onClick={() => handleAddQuestion(index)}
                >
                  {index + 1}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddQuestion(formData.questions.length)}
                className="bg-white w-16 h-16 shadow-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        )}

        {showQuestion && (
          <AddQuestion
            formData={formData}
            questionNum={questionNum}
            handleChange={handleQuestionChange}
          />
        )}
      </form>
    </>
  );
}
