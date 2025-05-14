"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
    ClockIcon,
    HandIcon,
    PlusCircleIcon,
    PuzzleIcon,
    Redo2Icon,
    StarsIcon,
    TagIcon,
    UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import TextArea from "../common/text/text-area";
import Image from "next/image";
import { Input } from "../common/shadcn-ui/input";
import Button from "../common/buttons/button";
import { createEventUsingAi } from "@/proxy/create-event-using-ai";
import LogoLoading from "../common/logo-loading";
import { EventDataDto } from "@/dtos/event-data.dto";
import { Category } from "@/util/categories";
import createEventAction from "@/proxy/event/create-event-action";
import TextField from "../common/text/text-field";
import Radio from "../common/radio-group";
import CategoryComponent from "@/components/common/category";
import LoadingWrapper from "../common/loading-wrapper";
import AddCategoryModal from "../common/buttons/add-category-modal";
import { Role } from "@/dtos/roles-data.dto";
import LinkedUser from "./create-event/linked-user";
import LinkUserModal from "./create-event/link-user-modal";
import { UserDataDto } from "@/dtos/user-data.dto";
import { useRolesContext } from "@/store/roles-context";

export default function CreateEventDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreatingUsingAI, setIsCreatingUsingAI] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [extraInstructions, setExtraInstructions] = useState("");
    const [result, setResult] = useState<EventDataDto>({} as EventDataDto);
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    const { roles, setRoles } = useRolesContext();
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    // make another date that is 1 day from startDate
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = endDateObj.toISOString().split("T")[0];
    const [endDateMin, setEndDateMin] = useState(endDate);
    const [endDateVal, setEndDateVal] = useState(endDate);
    const imageInputRef = useRef({} as HTMLInputElement);

    const getErrorMessage = (error: any) => {
        switch (error) {
            case "The event conflicts with an existing event(s)":
                return "تعارض الفعالية مع فعالية اخرى, الرجاء اختيار وقت اخر";
            default:
                return "حدث خطأ ما, الرجاء المحاولة مره اخرى";
        }
    };

    const [selectedCatagories, setSelectedCatagories] = useState<Category[]>(
        []
    );

    const handleImageUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        if (e.target.files[0].size > 2 * 1024 * 1024) {
            setError("حجم الصورة يجب ان يكون اقل من 2 ميغابايت");
            return;
        }
        setImageFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleCreateEventUsingAI = async () => {
        setIsLoading(true);
        setError("");

        if (!image) {
            setError("يرجى ارفاق صورة للفعالية");
            setIsLoading(false);
            return;
        }
        const file = imageInputRef.current.files?.[0] as File;
        const formData = new FormData();
        formData.append("image", file);
        formData.append("extraInstructions", extraInstructions);
        const result = await createEventUsingAi(formData);
        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }
        setResult(result);
        setSelectedCatagories(result.categories);
        setIsOnline(result.isOnline);
        setStartDate(result.startDateTime.split("T")[0]);
        setEndDateMin(result.endDateTime.split("T")[0]);
        setEndDateVal(result.endDateTime.split("T")[0]);
        setIsLoading(false);
    };

    const resetDialog = () => {
        setError("");
        setExtraInstructions("");
        setResult({} as EventDataDto);
        setImage("");
        setIsCreatingUsingAI(false);
        setSelectedCatagories([]);
        setRoles([]);
        setIsOnline(false);
        setStartDate(today);
        setEndDateMin(endDate);
        setEndDateVal(endDate);
        setIsLoading(false);
        setImageFile(null);
        
    };

    const removeUser = (user: UserDataDto) => {
        setRoles(prevState => {
            return prevState.filter(role => role.user.id !== user.id);
        });
    };

    const moderators = roles.filter(role => role.role === Role.MODERATOR);
    const presenters = roles.filter(role => role.role === Role.PRESENTER);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                if (!isOpen) {
                    resetDialog();
                }
                setIsOpen(!isOpen);
            }}
        >
            <DialogTrigger>
                <div className="bg-custom-gradient  px-6 py-4 text-white  text-xl flex justify-center items-center gap-3 bg-[length:120%] hover:bg-right transition-all rounded-full font-semibold text-nowrap ">
                    نسق فعاليتك <PlusCircleIcon />
                </div>
            </DialogTrigger>
            <DialogContent
                dir="rtl"
                className="bg-white !rounded-3xl max-h-[800px] overflow-hidden"
            >
                <DialogHeader className=" !text-right  ps-4 ">
                    <DialogTitle>نسق فعاليتك</DialogTitle>
                    <DialogDescription>
                        <AnimatePresence>
                            <span className="h-5 block">
                                {isCreatingUsingAI && !result.title ? (
                                    <motion.span
                                        key={"ai"}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="absolute"
                                    >
                                        ارفق صورة للفعالية والباقي علينا
                                    </motion.span>
                                ) : !isCreatingUsingAI && !result.title ? (
                                    <motion.span
                                        key={"default"}
                                        exit={{ opacity: 0, x: -10 }}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute"
                                    >
                                        اختر الطريقة التي تريد تنسيق فعاليتك بها
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key={"result"}
                                        exit={{ opacity: 0, x: -10 }}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute"
                                    >
                                        راجع المعلومات التي تم تنسيقها
                                    </motion.span>
                                )}
                            </span>
                        </AnimatePresence>
                    </DialogDescription>
                </DialogHeader>
                {!isCreatingUsingAI && (
                    <div className="grid sm:grid-cols-2 grid-cols-1 place-items-center gap-2 sm:p-5">
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                borderColor: "#666666",
                            }}
                            onClick={() => setIsCreatingUsingAI(true)}
                            className="cursor-pointer bg-gradient-to-br hover:bg-right to-custom-dark-purple from-custom-light-purple w-full h-48 grid place-items-center rounded-3xl shadow-custom text-center group"
                        >
                            <div className="grid place-items-center text-white font-bold">
                                <StarsIcon size={32} />
                                <div className="text-lg mt-2">
                                    نسق باستخدام <br />
                                    الذكاء الاصطناعي
                                </div>
                            </div>
                        </motion.div>
                        <Link href="/create-event">
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    borderColor: "#666666",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full h-48 aspect-square rounded-3xl grid place-items-center cursor-pointer group shadow-custom"
                            >
                                <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray">
                                    <HandIcon size={32} />
                                    <div className="text-lg mt-2 font-bold">
                                        نسق الفعالية يدويا
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                )}
                {isCreatingUsingAI && !isLoading && !result.title && (
                    <div className="py-2 flex flex-col gap-5">
                        <div className="flex">
                            <div
                                onClick={() => {
                                    setIsCreatingUsingAI(false);
                                }}
                                className={
                                    "cursor-pointer z-10 h-min flex gap-2 text-custom-light-gray hover:text-black transition-colors"
                                }
                            >
                                العودة
                                <Redo2Icon />
                            </div>
                        </div>
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
                        <TextArea
                            value={extraInstructions}
                            onChange={e => setExtraInstructions(e.target.value)}
                            className="!resize-y"
                            placeholder="هل لديك تعليمات اضافية ؟"
                            name="extra_instructions"
                        />
                        {error && (
                            <div className="text-red-500 text-center mt-2">
                                {error}
                            </div>
                        )}
                        <DialogFooter className="flex !justify-between gap-2">
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                الغاء
                            </Button>
                            <Button
                                className="!flex gap-2 justify-center px-5"
                                gradient
                                onClick={handleCreateEventUsingAI}
                            >
                                انشاء
                                <StarsIcon />
                            </Button>
                        </DialogFooter>
                    </div>
                )}
                {isLoading && (
                    <div className="grid place-items-center">
                        <div className="w-20">
                            <LogoLoading />
                        </div>
                    </div>
                )}
                {result.title && (
                    <form
                        className="overflow-y-auto max-h-[600px] px-2"
                        action={async formData => {
                            for (const category of selectedCatagories) {
                                formData.append("categories", category);
                            }

                            // turn the image to file
                            if ((formData.get("image") as File).size === 0) {
                                formData.delete("image");
                            }

                            if (imageFile) {
                                formData.append("image", imageFile);
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

                            const error = await createEventAction(
                                formData,
                                formDataRole
                            );
                            if (error) {
                                setError(getErrorMessage(error));
                                return;
                            }
                            setIsOpen(false);
                            setError("");
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
                                defaultValue={result.title}
                            />
                            <TextArea
                                placeholder="وصف الفعالية"
                                name="description"
                                defaultValue={result.description}
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
                                            <Image
                                                src={image}
                                                alt="preview"
                                                fill
                                            />
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
                                        "cursor-pointer " +
                                        (image ? "hidden" : "")
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
                                defaultValue={
                                    result.isOnline ? "true" : "false"
                                }
                                name={"isOnline"}
                                options={["حضوري", "عن بعد"]}
                                values={["false", "true"]}
                            />
                            <label className="block text-lg text-custom-gray">
                                جنس الحاضرين
                            </label>
                            <Radio
                                name={"gender"}
                                defaultValue={result.gender}
                                options={["ذكر", "انثى", "الجميع"]}
                                values={["MALE", "FEMALE", "BOTH"]}
                            />
                            <TextField
                                placeholder={
                                    isOnline ? "رابط الفعالية" : "مكان الفعالية"
                                }
                                name="location"
                                defaultValue={result.location}
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
                                    defaultValue={result.seatCapacity}
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
                        <div className="flex gap-4 flex-col">
                            <label
                                htmlFor="startDateTime"
                                className="block text-lg text-custom-gray text-nowrap"
                            >
                                تاريخ بدأ الفعالية
                            </label>
                            <Input
                                className="w-min"
                                type="date"
                                name="startDateTime"
                                min={today}
                                value={startDate}
                                onChange={e => {
                                    const startDateObj = new Date(
                                        e.target.value
                                    );
                                    const endDateObj = new Date(startDateObj);
                                    endDateObj.setDate(
                                        endDateObj.getDate() + 1
                                    );
                                    const endDate = endDateObj
                                        .toISOString()
                                        .split("T")[0];
                                    setStartDate(e.target.value);
                                    setEndDateMin(endDate);
                                    setEndDateVal(endDate);
                                }}
                            />
                            <label
                                htmlFor="endDateTime"
                                className="block text-lg text-custom-gray text-nowrap"
                            >
                                تاريخ انتهاء الفعالية
                            </label>
                            <Input
                                className="w-min"
                                type="date"
                                name="endDateTime"
                                min={endDateMin}
                                value={endDateVal}
                                onChange={e => {
                                    setEndDateVal(e.target.value);
                                }}
                            />
                        </div>
                        <div className="max-w-96 w-full grid gap-5 mt-2">
                            <label className="block text-lg text-custom-gray">
                                هل هي فعالية عامة ام خاصة
                            </label>
                            <Radio
                                name={"isPublic"}
                                options={["عامة", "خاصة"]}
                                values={["true", "false"]}
                                defaultValue={
                                    result.isPublic ? "true" : "false"
                                }
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
                                    selected={selectedCatagories.includes(
                                        category
                                    )}
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
                        <motion.h3
                            layout
                            className="block text-lg text-custom-gray mt-5"
                        >
                            منظمين الفعالية التعليمية
                        </motion.h3>
                        <motion.div layout className="flex gap-2 mt-2">
                            {moderators.map(moderator => (
                                <div
                                    key={moderator.user.id}
                                    onClick={e => {
                                        e.preventDefault();
                                        removeUser(moderator.user);
                                    }}
                                >
                                    <LinkedUser
                                        key={moderator.user.id}
                                        user={moderator.user}
                                    />
                                </div>
                            ))}
                            {moderators.length < 3 && (
                                <LinkUserModal
                                    role={Role.MODERATOR}
                                    descriptionText="اختر المستخدم الذي تريد اضافته كمنظم"
                                />
                            )}
                        </motion.div>

                        {/* Presenters Section */}

                        <motion.h3
                            layout
                            className="block text-lg text-custom-gray mt-5"
                        >
                            مقدمين الفعالية التعليمية
                        </motion.h3>
                        <motion.div layout className="flex gap-2 mt-2">
                            {presenters.map(presenter => (
                                <div
                                    key={presenter.user.id}
                                    onClick={e => {
                                        e.preventDefault();
                                        removeUser(presenter.user);
                                    }}
                                >
                                    <LinkedUser
                                        key={presenter.user.id}
                                        user={presenter.user}
                                    />
                                </div>
                            ))}
                            {presenters.length < 3 && (
                                <LinkUserModal
                                    role={Role.PRESENTER}
                                    descriptionText="اختر المستخدم الذي تريد اضافته كمقدم"
                                />
                            )}
                        </motion.div>
                        {error && (
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
                )}
            </DialogContent>
        </Dialog>
    );
}
