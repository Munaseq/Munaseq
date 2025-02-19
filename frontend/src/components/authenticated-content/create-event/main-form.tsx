import Image from "next/image";
import puzzleIcon from "@/assets/icons/puzzle-gradient.svg";
import CreateEventCard from "./create-event-card";
import TextField from "@/components/common/text/text-field";
import TextArea from "@/components/common/text/text-area";
import { Input } from "@/components/common/shadcn-ui/input";
import { useState, useRef } from "react";
import Button from "@/components/common/buttons/button";
export default function MainForm({
    nextStepHandler,
    step
}: Readonly<{ nextStepHandler: () => void , step: number}>) {
    const [image, setImage] = useState("");
    const ref = useRef({} as HTMLInputElement);

    const handleImageUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        setImage(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <CreateEventCard actual={step} goal={1}>
            <h1 className="flex items-center gap-2 font-bold text-xl">
                <Image src={puzzleIcon} alt="puzzle icon" />
                المعلومات الاساسية
            </h1>
            <div className="max-w-96 w-full grid gap-5">
                <TextField placeholder="عنوان الفعالية" name="title" />
                <TextArea placeholder="وصف الفعالية" name="description" />
                <div className="grid gap-3 ">
                    <label
                        htmlFor="image"
                        className="block text-lg text-custom-gray"
                    >
                        صورة العرض
                    </label>

                    {image ? (
                        <div className="flex items-center gap-5">
                            <div className="w-20 aspect-square relative  overflow-hidden">
                                <Image src={image} alt="preview" fill />
                            </div>
                            <button
                                className="rounded-3xl p-2"
                                onClick={e => {
                                    e.preventDefault();
                                    ref.current.click();
                                }}
                            >
                                تغيير الصورة
                            </button>
                        </div>
                    ) : null}
                    <Input
                        name="image"
                        id="image"
                        type="file"
                        className={"cursor-pointer " + (image ? "hidden" : "")}
                        accept="image/png, image/jpeg , image/jpg"
                        onChange={handleImageUpload}
                        ref={ref}
                    />
                </div>
            </div>
            <div className="flex flex-row-reverse w-full mt-3">
                <Button
                    onClick={e => {
                        e.preventDefault();
                        nextStepHandler();
                    }}
                    gradient
                    className="!px-10"
                >
                    التالي
                </Button>
            </div>
        </CreateEventCard>
    );
}
