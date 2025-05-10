"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { Input } from "@/components/common/shadcn-ui/input";
import TextArea from "@/components/common/text/text-area";
import TextField from "@/components/common/text/text-field";
import { EventDataDto } from "@/dtos/event-data.dto";
import {
    ClockIcon,
    PencilIcon,
    PuzzleIcon,
    TagIcon,
    UsersRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Radio from "@/components/common/radio-group";
import { useRef, useState } from "react";
import AddCategoryModal from "@/components/common/buttons/add-category-modal";
import { Category } from "@/util/categories";
import CategoryComponent from "@/components/common/category";
import LoadingWrapper from "@/components/common/loading-wrapper";
import Button from "@/components/common/buttons/button";
import editEventAction from "@/proxy/event/edit-event-action";

export default function EditEventDialog({ event }: { event: EventDataDto }) {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(event.imageUrl);
    const [isOnline, setIsOnline] = useState(false);
    const imageInputRef = useRef({} as HTMLInputElement);
    const [selectedCatagories, setSelectedCatagories] = useState<Category[]>(
        []
    );
    const [error, setError] = useState({ message: "" });

    const handleImageUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const getErrorMessage = (error: any) => {
        switch (error) {
            case "The event conflicts with an existing event(s)":
                return "تعارض الفعالية مع فعالية اخرى, الرجاء اختيار وقت اخر";
            default:
                return "حدث خطأ ما, الرجاء المحاولة مره اخرى";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="">
                <div className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer">
                    تعديل الفعالية <PencilIcon />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl w-[90%] h-[90%] max-h-[800px] overflow-hidden">
                <DialogHeader className="!text-right ps-4">
                    <DialogTitle>تعديل الفعالية</DialogTitle>
                    <DialogDescription>
                        يمكنك تعديل الفعالية من هنا
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="overflow-y-auto max-h-[900px] px-2"
                    action={async formData => {
                        for (const category of selectedCatagories) {
                            formData.append("categories", category);
                        }

                        // turn the image to file
                        if ((formData.get("image") as File).size === 0) {
                            formData.delete("image");
                        }

                        const error = await editEventAction(formData, event.id);
                        if (error) {
                            setError(error);
                            return;
                        }
                        setIsOpen(false);
                        setError({ message: "" });
                    }}
                >
                    <h1 className="flex items-center gap-2 font-bold text-xl">
                        <PuzzleIcon
                            className="text-custom-light-purple"
                            size={32}
                        />
                        المعلومات الاساسية
                    </h1>
                    <div className="max-w-96 w-full grid gap-5">
                        <TextField
                            placeholder="عنوان الفعالية"
                            name="title"
                            defaultValue={event.title}
                        />
                        <TextArea
                            placeholder="وصف الفعالية"
                            name="description"
                            defaultValue={event.description}
                        />
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
                                            imageInputRef.current.click();
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
                                className={
                                    "cursor-pointer " + (image ? "hidden" : "")
                                }
                                accept="image/png, image/jpeg , image/jpg"
                                onChange={handleImageUpload}
                                ref={imageInputRef}
                            />
                        </div>
                    </div>
                    <h1 className="flex items-center gap-2 font-bold text-xl mt-10">
                        <UsersRoundIcon
                            size={32}
                            className="text-custom-light-purple"
                        />
                        معلومات الحضور
                    </h1>
                    <div className="max-w-96 w-full grid gap-5 mt-2">
                        <label className="block text-lg text-custom-gray">
                            طريقة حضور الفعالية
                        </label>
                        <Radio
                            onChange={() => {
                                setIsOnline(prev => !prev);
                            }}
                            defaultValue={event.isOnline ? "true" : "false"}
                            name={"isOnline"}
                            options={["حضوري", "عن بعد"]}
                            values={["false", "true"]}
                        />
                        <label className="block text-lg text-custom-gray">
                            جنس الحاضرين
                        </label>
                        <Radio
                            name={"gender"}
                            defaultValue={event.gender}
                            options={["ذكر", "انثى", "الجميع"]}
                            values={["MALE", "FEMALE", "BOTH"]}
                        />
                        <TextField
                            placeholder={
                                isOnline ? "رابط الفعالية" : "مكان الفعالية"
                            }
                            name="location"
                            defaultValue={event.location}
                        />
                        <div className="flex gap-4">
                            <label
                                htmlFor="seatCapacity"
                                className="block text-lg text-custom-gray text-nowrap"
                            >
                                عدد الحاضرين
                            </label>
                            <Input
                                type="number"
                                name="seatCapacity"
                                defaultValue={event.seatCapacity}
                                min={1}
                                max={1000}
                            />
                        </div>
                    </div>
                    <h1 className="flex items-center gap-2 font-bold text-xl mt-10">
                        <ClockIcon
                            className="text-custom-light-purple"
                            size={32}
                        />
                        جدولة الفعالية
                    </h1>
                    <div className="max-w-96 w-full grid gap-5 mt-2">
                        
                        <label className="block text-lg text-custom-gray">
                            هل هي فعالية عامة ام خاصة
                        </label>
                        <Radio
                            name={"isPublic"}
                            options={["عامة", "خاصة"]}
                            values={["true", "false"]}
                            defaultValue={event.isPublic ? "true" : "false"}
                        />
                    </div>
                    <h1 className="flex items-center gap-2 font-bold text-xl mt-10">
                        <TagIcon
                            className="text-custom-light-purple"
                            size={32}
                        />
                        لمن توجه اليه الفعالية
                    </h1>

                    {/* Category Selection Section */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {selectedCatagories.map(category => (
                            <CategoryComponent
                                onClick={() => {
                                    setSelectedCatagories(prevState => {
                                        return prevState.filter(
                                            t => t !== category
                                        );
                                    });
                                }}
                                selected={selectedCatagories.includes(category)}
                                checked
                                active
                                key={category}
                            >
                                {category}
                            </CategoryComponent>
                        ))}

                        <div className="grid place-items-center">
                            {selectedCatagories.length < 3 && (
                                <AddCategoryModal
                                    limit={3}
                                    descriptionText="اختر الاهتمامات التي تدور حولها الفعالية"
                                    excludedCategories={selectedCatagories}
                                    onCategorySelect={(
                                        category: Category[]
                                    ) => {
                                        setSelectedCatagories(prevState => [
                                            ...prevState,
                                            ...category,
                                        ]);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {error.message && (
                        <p className="text-red-500 text-center mt-5">
                            حدث خطأ, الرجاء المحاولة مره اخرى.
                        </p>
                    )}
                    <div className="w-full grid place-items-center">
                        <LoadingWrapper>
                            <div className="flex flex-row-reverse justify-between w-full mt-10">
                                <Button gradient className="">
                                    تنسيق الفعالية
                                </Button>
                                <Button
                                    onClick={e => {
                                        e.preventDefault();
                                        setIsOpen(false);
                                    }}
                                >
                                    الغاء
                                </Button>
                            </div>
                        </LoadingWrapper>
                    </div>

                    {/* end */}
                </form>
            </DialogContent>
        </Dialog>
    );
}
