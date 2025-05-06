"use client";

import CreateEventCard from "./create-event-card";
import Button from "@/components/common/buttons/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingWrapper from "@/components/common/loading-wrapper";
import CategoryComponent from "@/components/common/category";
import AddCategoryModal from "@/components/common/buttons/add-category-modal";
import { UserDataDto } from "@/dtos/user-data.dto";
import { TagIcon } from "lucide-react";
import { Category } from "@/util/categories";
import LinkedUser from "./linked-user";
import LinkUserModal from "./link-user-modal";
import { useRolesContext } from "@/store/roles-context";
import { Role, RoleDataDto } from "@/dtos/roles-data.dto";

export default function forwhoForm({
    onCategoriesChange,
    step,
    prevStepHandler,
    error,
}: Readonly<{
    onCategoriesChange: (categories: string[]) => void;
    step: number;
    prevStepHandler: () => void;
    error: any;
}>) {
    const [selectedCatagories, setSelectedCatagories] = useState<Category[]>(
        []
    );
    const { roles, setRoles } = useRolesContext();

    const removeUser = (user: UserDataDto) => {
        setRoles(prevState => {
            return prevState.filter(role => role.user.id !== user.id);
        });
    };

    useEffect(() => {
        onCategoriesChange(selectedCatagories);
    }, [selectedCatagories]);

    const moderators = roles.filter(role => role.role === Role.MODERATOR);
    const presenters = roles.filter(role => role.role === Role.PRESENTER);

    return (
        <CreateEventCard actual={step} goal={4}>
            <motion.h2
                layout
                className="flex items-center gap-2 font-bold text-xl"
            >
                <TagIcon className="text-custom-light-purple" size={32} />
                لمن توجه اليه الفعالية
            </motion.h2>

            {/* Category Selection Section */}
            <motion.div layout className="flex flex-wrap gap-2 mt-5">
                {selectedCatagories.map(category => (
                    <CategoryComponent
                        onClick={() => {
                            setSelectedCatagories(prevState => {
                                return prevState.filter(t => t !== category);
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

                <motion.div layout className="grid place-items-center">
                    {selectedCatagories.length < 3 && (
                        <AddCategoryModal
                            limit={3}
                            descriptionText="اختر الاهتمامات التي تدور حولها الفعالية"
                            excludedCategories={selectedCatagories}
                            onCategorySelect={(category: Category[]) => {
                                setSelectedCatagories(prevState => [
                                    ...prevState,
                                    ...category,
                                ]);
                            }}
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Moderators Section */}

            <motion.h3 layout className="block text-lg text-custom-gray mt-5">
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

            <motion.h3 layout className="block text-lg text-custom-gray mt-5">
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

            {/* Error Message */}
            {error.message && (
                <p className="text-red-500 text-center mt-5">
                    {error.message === 'Conflict' ? (<>يتعارض الفعالية مع فعالية اخرى انت بها</>) : (<>حدث خطأ, الرجاء المحاولة مره اخرى.</>)}
                </p>
            )}

            {/* Navigation Buttons */}
            <motion.div layout className="w-full grid place-items-center">
                <LoadingWrapper>
                    <div className="flex flex-row-reverse justify-between w-full mt-10">
                        <Button gradient className="">
                            تنسيق الفعالية
                        </Button>
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                prevStepHandler();
                            }}
                            className="!px-10"
                        >
                            السابق
                        </Button>
                    </div>
                </LoadingWrapper>
            </motion.div>
        </CreateEventCard>
    );
}
