"use client";

import React from "react";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import { FileQuestion } from "lucide-react";
import { motion } from "framer-motion";

type AddQuestionProps = {
  formData: any;
  questionNum: number;
  handleChange: any;
  handleAddQuestion: any;
  handleAddOption: any;
  handleRemoveOption: any;
  handleOptionChange: any;
  showQuestion: any;
  handleShowQuestion: any;
};

const MCS = ["أ", "ب", "ج", "د"];

export default function AddQuestion({
  formData,
  questionNum,
  handleChange,
  handleAddQuestion,
  handleAddOption,
  handleRemoveOption,
  handleOptionChange,
  showQuestion,
  handleShowQuestion,
}: AddQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="font-bold flex items-center text-3xl gap-2 mt-4"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FileQuestion className="text-custom-light-purple" size={40} />
        </motion.div>
        السؤال {questionNum + 1}
      </motion.h1>

      <div className="flex flex-col gap-8 my-10">
        <motion.div
          className="flex gap-24 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex gap-4 items-center">
            <label className="block text-lg text-custom-gray">نوع السؤال</label>
            <select
              name="questionType"
              onChange={handleChange}
              value={formData.questions[questionNum].questionType}
              className="cursor-pointer text-lg hover:text-custom-light-purple bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all"
            >
              <option value="multiple-choice">اختيار من متعدد</option>
              <option value="essay">مقالي</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <label className="block text-lg text-custom-gray">السؤال</label>
          <div className="relative">
            <Input
              type="text"
              name="text"
              onChange={handleChange}
              value={formData.questions[questionNum].text}
              placeholder="أدخل السؤال هنا..."
              className="w-full h-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {formData.questions[questionNum].questionType === "multiple-choice" && (
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-bold text-xl text-custom-gray">الخيارات</h2>
            {formData.questions[questionNum].options.map(
              (option: string, index: number) => (
                <motion.div
                  key={index}
                  className="flex gap-4 items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <motion.div
                    className="flex justify-center items-center w-10 h-10 bg-gradient-to-l from-custom-dark-purple to-custom-light-purple text-white rounded-lg"
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-lg font-semibold">{MCS[index]}</span>
                  </motion.div>
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      name="option"
                      onChange={(e) => handleOptionChange(index, e)}
                      value={option}
                      placeholder="أدخل الخيار هنا..."
                      className="w-full h-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </motion.div>
              )
            )}

            <motion.div
              className="flex gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              {formData.questions[questionNum].options.length < 4 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button gradient onClick={handleAddOption}>
                    إضافة خيار
                  </Button>
                </motion.div>
              )}

              {formData.questions[questionNum].options.length > 2 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button onClick={handleRemoveOption}>إزالة خيار</Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {formData.questions[questionNum].questionType === "multiple-choice" && (
          <motion.div
            className="flex gap-4 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <label className="block text-lg text-custom-gray">
              الإجابة الصحيحة
            </label>
            <select
              name="correctAnswer"
              onChange={handleChange}
              value={formData.questions[questionNum].correctAnswer}
              className="cursor-pointer text-lg hover:text-custom-light-purple bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all"
            >
              <option value="">اختر الإجابة الصحيحة</option>
              {formData.questions[questionNum].options.map(
                (_: string, index: number) => (
                  <option key={index} value={MCS[index]}>
                    {MCS[index]}
                  </option>
                )
              )}
            </select>
          </motion.div>
        )}

        {formData.questions[questionNum].questionType === "essay" && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-lg text-custom-gray">
              الإجابة الصحيحة
            </label>
            <div className="relative">
              <Input
                type="text"
                name="correctAnswer"
                onChange={handleChange}
                value={formData.questions[questionNum].correctAnswer}
                placeholder="أدخل الإجابة النموذجية هنا..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm placeholder:text-gray-400"
              />
            </div>
          </motion.div>
        )}

        <motion.div className="flex justify-between items-center mt-8">
          {showQuestion && (
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleShowQuestion}>رجوع</Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              gradient
              onClick={() => handleAddQuestion(questionNum + 1)}
              className="px-6"
            >
              حفظ السؤال وإضافة سؤال جديد
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
