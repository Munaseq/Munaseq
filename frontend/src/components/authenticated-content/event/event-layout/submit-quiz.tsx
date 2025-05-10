"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import submitQuizAction from "@/proxy/quizzes/submit-quiz-action";

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
  time: number; // in minutes
  quizId: string;
  eventId: string;
};

export default function TakeQuiz({ questions, time, quizId, eventId }: Props) {
  const router = useRouter();

  const totalSeconds = time * 60;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => ({ questionTitle: q.text, answer: "" }))
  );
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (newAnswer: string) => {
    const updated = [...answers];
    updated[currentIndex].answer = newAnswer;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    alert("تم تسليم الاختبار!");


    const answersToSubmit = {
      answers: answers,
    };

    const error = await submitQuizAction(quizId, eventId, answersToSubmit);
    if (error !== undefined && error !== null) {
      console.error("Error creating activity:", error);
    }
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (submittedRef.current) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submittedRef.current) {
        handleSubmit();

        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && !submittedRef.current) {
        handleSubmit();
      }
    };

    const patchRouterPush = () => {
      const originalPush = router.push;
      router.push = ((...args: Parameters<typeof router.push>) => {
        if (!submittedRef.current) {
          handleSubmit();
        }
        return originalPush(...args);
      }) as typeof router.push;
    };

    patchRouterPush();

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router]);

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full text-right">
        <div className="text-sm text-gray-600 mb-2">
          الوقت المتبقي: {formatTime(timeLeft)}
        </div>
        <div
          dir="ltr"
          className="w-full h-3 bg-custom-light-purple rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gray-200"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: timeLeft / totalSeconds }}
            transition={{ ease: "linear", duration: 1 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

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
        <Button onClick={handleNextAndSubmit} disabled={submitted}>
          {currentIndex === questions.length - 1 ? "تسليم" : "التالي"}
        </Button>
      </div>
    </div>
  );
}
