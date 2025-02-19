"use client";

import Button from "@/components/common/buttons/button";
import LoadingWrapper from "@/components/common/loading-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { Input } from "@/components/common/shadcn-ui/input";
import addMateiralAction from "@/proxy/material/add-material-action";
import { useState, useRef } from "react";

export default function AddMaterial({ eventId }: { eventId: string }) {
    const [file, setFile] = useState("");
    const [error, setError] = useState("");
    const ref = useRef({} as HTMLInputElement);
    const handleUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        setFile(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <Dialog>
            <DialogTrigger>
                <div className="border-4 border-[#949494] border-dashed w-56 aspect-square rounded-3xl grid place-items-center transition-colors group hover:border-[#666666] cursor-pointer">
                    <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-12"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <p className="text-lg">أضف محتوى</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>اضافة محتوى</DialogTitle>
                    <DialogDescription>
                        <form
                        className="grid gap-4"
                            action={async (formData: FormData) => {

                                if (!ref.current.value) {
                                    setError("يجب اختيار ملف");
                                    return;
                                }
                               
                                const error: { message: string } | undefined =
                                    await addMateiralAction(eventId, formData);
                                if (error?.message) {
                                    setError("حدث خطأ ما");
                                }
                            }}
                        >
                            <label htmlFor="Materials">
                                ارفق الملف الذي تريد اضافته للفعالية
                            </label>
                            <div className="grid gap-3 mt-5">
                                {file ? (
                                    <div className="flex items-center gap-5">
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-custom-gray"
                                        >
                                            عرض الملف
                                        </a>
                                        <button
                                            className="rounded-3xl p-2"
                                            onClick={e => {
                                                e.preventDefault();
                                                ref.current.click();
                                            }}
                                        >
                                            تغيير الملف
                                        </button>
                                    </div>
                                ) : null}
                                <Input
                                    name="materials"
                                    id="materials"
                                    type="file"
                                    className={
                                        "cursor-pointer " +
                                        (file ? "hidden" : "")
                                    }
                                    onChange={handleUpload}
                                    ref={ref}
                                />
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            <LoadingWrapper>
                                <Button className="mt-2" gradient>
                                    تثبيت
                                </Button>
                            </LoadingWrapper>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
