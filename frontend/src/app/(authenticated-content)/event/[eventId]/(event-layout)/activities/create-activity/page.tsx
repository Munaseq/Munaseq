"use client";

import React, { useState } from "react";
import Image from "next/image";
import fileIcon from "@/public/file-icon.svg";
import { Input } from "@/components/common/shadcn-ui/input";

type Question = {
  text: string;
  questionType: string;
  options: string;
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
  const [formData, setFormData] = useState<Activity>({
    activityType: "",
    activityTimeLimit: 0,
    startDate: "",
    endDate: "",
    questions: [],
  });

  const [numOfMcs, setNumOfMcs] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: "", questionType: "", options: "", correctAnswer: "" },
      ],
    }));
  };

  return (
    <>
      <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
        <Image className="sm:w-12 w-10" src={fileIcon} alt="material icon" />
        إضافة نشاط
      </h1>

      <form className="space-y-6">
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
              value={formData.startDate}
              onChange={handleChange}
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
              >
                {index + 1}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-white w-16 h-16 shadow-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* this well be addQustion comonent */}
        <div>
          <h2 className="font-bold flex items-center text-2xl gap-2 mt-4">
            <Image
              className="sm:w-12 w-10"
              src={fileIcon}
              alt="material icon"
            />
            إضافة سؤال
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label htmlFor="questionType">نوع السؤال</label>
              <select name="questionType" onChange={handleChange}>
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
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="question">السؤال</label>
              <Input type="text" name="question" onChange={handleChange} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
