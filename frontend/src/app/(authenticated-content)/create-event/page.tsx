"use client";

// import CreateEventProgress from "@/components/authenticated-content/create-event/create-event-progress";
import Image from "next/image";
import plusCricle from "@/assets/icons/plus-circle-gradient.svg";
import Title from "@/components/common/text/title";
import { Metadata } from "next";
import MainForm from "@/components/authenticated-content/create-event/main-form";
import { useRef, useState } from "react";
import ParticipantsForm from "@/components/authenticated-content/create-event/participants-form";
import TimeForm from "@/components/authenticated-content/create-event/time-form";
import ForwhoForm from "@/components/authenticated-content/create-event/forwho-form";
import createEventAction from "@/proxy/event/create-event-action";

// export const metadata: Metadata = {
//     title: "انشاء فعالية",
// };

export default function CreateEvent() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState({ message: "" });
  const nextStepHandler = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const prevStepHandler = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const selectedCategories = useRef([] as string[]);
  const categoriesHandler = (categories: string[]) => {
    selectedCategories.current = categories;
  };
  const roles = useRef([] as { assignedUserId: string; role: string }[]);
  const rolesHandler = (newRole: { assignedUserId: string; role: string }) => {
    roles.current.push(newRole);
    console.log(newRole);
    console.log(roles);
    console.log(roles.current);
  };

  return (
    <div className="overflow-hidden">
      <Title>
        <Image src={plusCricle} alt="plus icon" />
        نسق فعاليتك
      </Title>
      <div className="grid place-items-center">
        {/* <CreateEventProgress step={1} /> */}
        <form
          action={async (formData) => {
            for (const category of selectedCategories.current) {
              formData.append("categories", category);
            }
            const formDataRole = new FormData();
            for (const role of roles.current) {
              formDataRole.append("roles", JSON.stringify(role));
            }

            const error: { message: string } = await createEventAction(
              formData,
              formDataRole
            );
            if (error.message) {
              setError(error);
            }
          }}
          className="overflow-hidden p-2 flex justify-center w-full relative"
        >
          <div className="absolute overflow-hidden flex justify-center w-full h-full p-2">
            <MainForm nextStepHandler={nextStepHandler} step={step} />
            <TimeForm
              nextStepHandler={nextStepHandler}
              prevStepHandler={prevStepHandler}
              step={step}
            />
            <ForwhoForm
              prevStepHandler={prevStepHandler}
              onCategoriesChange={categoriesHandler}
              error={error}
              step={step}
              onRoleChange={rolesHandler}
            />
          </div>
          <ParticipantsForm
            nextStepHandler={nextStepHandler}
            prevStepHandler={prevStepHandler}
            step={step}
          />
        </form>
      </div>
    </div>
  );
}
