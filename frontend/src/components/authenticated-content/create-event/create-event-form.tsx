"use client";

// import CreateEventProgress from "@/components/authenticated-content/create-event/create-event-progress";
import MainForm from "@/components/authenticated-content/create-event/main-form";
import { useEffect, useRef, useState } from "react";
import ParticipantsForm from "@/components/authenticated-content/create-event/participants-form";
import TimeForm from "@/components/authenticated-content/create-event/time-form";
import ForwhoForm from "@/components/authenticated-content/create-event/forwho-form";
import createEventAction from "@/proxy/event/create-event-action";
import CreateEventProgress from "./create-event-progress";
import { useRolesContext } from "@/store/roles-context";

// export const metadata: Metadata = {
//     title: "انشاء فعالية",
// };

export default function CreateEventForm() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState({ message: "" });
    const nextStepHandler = () => {
        setStep(prevStep => prevStep + 1);
    };
    const prevStepHandler = () => {
        setStep(prevStep => prevStep - 1);
    };
    const selectedCategories = useRef([] as string[]);
    const categoriesHandler = (categories: string[]) => {
        selectedCategories.current = categories;
    };
    const { roles } = useRolesContext();

    // This state will be used to watch the height of the modal and update the height of the modal when it changes, to make it look smooth
    const [observedModalHeight, setObservedModalHeight] = useState<
        number | "auto"
    >("auto");
    const oldHeight = useRef<number>(0);
    const modalHeightTrackRef = useRef<HTMLDivElement | null>(null);

    // This effect will observe the height of the modal and update the state when it changes
    useEffect(() => {
        if (modalHeightTrackRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                // We only have one entry, so we can use entries[0].

                if (entries[0].contentRect.height > oldHeight.current) {
                    oldHeight.current = entries[0].contentRect.height;
                    setObservedModalHeight(entries[0].contentRect.height);
                }
            });

            resizeObserver.observe(modalHeightTrackRef.current);
            return () => {
                // Cleanup the observer when the component is unmounted
                resizeObserver.disconnect();
            };
        }
    }, []);

    return (
        <>
            <div className="grid place-items-center">
                <CreateEventProgress step={step} />
            </div>
            <div className="grid place-items-center">
                <form
                    action={async formData => {
                        for (const category of selectedCategories.current) {
                            formData.append("categories", category);
                        }
                        const formDataRole = new FormData();
                        for (const role of roles) {
                            formDataRole.append(
                                "roles",
                                JSON.stringify({
                                    assignedUserId: role.user.id,
                                    role: role.role,
                                })
                            );
                        }

                        const error: { message: string } =
                            await createEventAction(formData, formDataRole);
                        if (error.message) {
                            setError(error);
                        }
                    }}
                    style={{
                        height: observedModalHeight,
                    }}
                    className="overflow-hidden grid place-items-center w-full relative"
                >
                    <div
                        ref={modalHeightTrackRef}
                        className="grid place-items-center w-full"
                    >
                        <div className="p-1 w-full grid place-items-center">
                            <MainForm
                                nextStepHandler={nextStepHandler}
                                step={step}
                            />
                            <ParticipantsForm
                                nextStepHandler={nextStepHandler}
                                prevStepHandler={prevStepHandler}
                                step={step}
                            />
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
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
