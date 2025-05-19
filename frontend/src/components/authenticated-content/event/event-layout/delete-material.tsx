"use client";

import Button from "@/components/common/buttons/button";
import LoadingWrapper from "@/components/common/loading-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import deleteMaterial from "@/proxy/material/delete-material-action";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function DeleteMaterial({ materialId }: { materialId: string }) {
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="absolute top-2 left-2 z-10 p-1 hover:text-gray-700 text-gray-500 transition-colors">
                <Trash2Icon size={24} />
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>حذف المحتوى</DialogTitle>
                    <DialogDescription>
                        هل انت متأكد من حذف المحتوى؟
                    </DialogDescription>
                    <form
                        className="grid gap-4"
                        action={async () => {
                            console.log("delete material action");
                            const error: { message: string } | undefined =
                                await deleteMaterial(materialId);
                            if (error?.message) {
                                setError("حدث خطأ ما");
                                return
                            }
                            setIsOpen(!isOpen);
                        }}
                    >

                        {error && <p className="text-red-500">{error}</p>}

                        <DialogFooter className="flex !justify-between sm:gap-0 gap-2 mt-10">
                            <LoadingWrapper>
                                <Button
                                    onClick={e => {
                                        e.preventDefault();
                                        setIsOpen(!isOpen);
                                    }}
                                >
                                    الغاء
                                </Button>
                                <Button className="mt-2 px-12" gradient>
                                    حذف
                                </Button>
                            </LoadingWrapper>
                        </DialogFooter>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
