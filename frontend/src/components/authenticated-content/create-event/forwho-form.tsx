"use client";

import Image from "next/image";
import CreateEventCard from "./create-event-card";
import Button from "@/components/common/buttons/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingWrapper from "@/components/common/loading-wrapper";
import CategoryComponent from "@/components/common/category";
import AddCategoryModal from "@/components/common/buttons/add-category-modal";
import getUserAction from "@/proxy/user/get-user-using-username-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import SearchUser from "@/components/authenticated-content/search-user";
import {PlusIcon, TagIcon, UserRoundIcon } from "lucide-react";
import { Category } from "@/util/categories";

export default function forwhoForm({
  onCategoriesChange,
  step,
  prevStepHandler,
  error,
  onRoleChange,
}: Readonly<{
  onCategoriesChange: (categories: string[]) => void;
  step: number;
  prevStepHandler: () => void;
  error: { message: string };
  onRoleChange: (role: { assignedUserId: string; role: string }) => void;
}>) {
  const [selectedCatagories, setSelectedCatagories] = useState<Category[]>([]);
  const [presenters, setPresenters] = useState([] as UserDataDto[]);
  const [moderators, setModerators] = useState([] as UserDataDto[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"presenters" | "moderators">(
    "presenters"
  );

  const [modalError, setModalError] = useState("");

  useEffect(() => {
    onCategoriesChange(selectedCatagories);
  }, [selectedCatagories]);

  const handleAddUser = async (username: string) => {
  
    setModalError("");
    const user = (await getUserAction(username));
    

    if (!user) {
      setModalError("المستخدم غير موجود");
      return;
    }
    // method call
    onRoleChange({ assignedUserId: user.id, role: modalType });
    console.log(user.id + " user id " + modalType + " role");
    if (
      modalType === "presenters" &&
      presenters.some((p) => p.username === user.username)
    ) {
      setModalError("هذا المستخدم موجود بالفعل كمقدم");
      return;
    }

    if (
      modalType === "moderators" &&
      moderators.some((m) => m.username === user.username)
    ) {
      setModalError("هذا المستخدم موجود بالفعل كمنظم");
      return;
    }

    if (modalType === "presenters") {
      setPresenters((prev) => [...prev, user]);
    } else {
      setModerators((prev) => [...prev, user]);
    }

    // setUsername("");
    setIsModalOpen(false);
  };

  return (
    <CreateEventCard actual={step} goal={4}>
      <h1 className="flex items-center gap-2 font-bold text-xl">
        <TagIcon className="text-custom-light-purple" size={32} />
        لمن توجه اليه الفعالية
      </h1>
      {/* Category Selection Section */}
      <motion.div layout className="flex flex-wrap gap-2 mt-5">
        {selectedCatagories.map((category) => (
          <CategoryComponent
          
            onClick={() => {
              setSelectedCatagories((prevState) => {
                return prevState.filter((t) => t !== category);
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
                setSelectedCatagories((prevState) => [
                  ...prevState,
                  ...category,
                ]);
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Moderators Section */}
      <div className="mt-10">
        <label className="block text-lg text-custom-gray">
          منظمين الفعالية التعليمية
        </label>
        <motion.div layout className="flex gap-2 mt-2">
          {moderators.map((moderator) => (
            <motion.div
              layout
              key={moderator.username}
              className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300"
            >
              { moderator.profilePictureUrl ? 
              <Image
                src={moderator.profilePictureUrl}
                alt={moderator.username}
                layout="fill"
                objectFit="cover"
              /> : <UserRoundIcon className="w-full h-full"/>}
            </motion.div>
          ))}
          {moderators.length < 3 && (
            <motion.div
              layout
              className="grid place-items-center w-12 h-12 rounded-full border border-dashed border-gray-400 cursor-pointer"
              onClick={() => {
                setModalType("moderators");
                setIsModalOpen(true);
              }}
            >
              <PlusIcon/>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Presenters Section */}
      <div className="mt-5">
        <label className="block text-lg text-custom-gray">
          مقدمين الفعالية التعليمية
        </label>
        <motion.div layout className="flex gap-2 mt-2">
          {presenters.map((presenter) => (
            <motion.div
              layout
              key={presenter.username}
              className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300"
            >
              { presenter.profilePictureUrl ? 
              <Image
                src={presenter.profilePictureUrl}
                alt={presenter.username}
                layout="fill"
                objectFit="cover"
              /> : <UserRoundIcon className="w-full h-full"/>}
            </motion.div>
          ))}
          {presenters.length < 3 && (
            <motion.div
              layout
              className="grid place-items-center w-12 h-12 rounded-full border border-dashed border-gray-400 cursor-pointer"
              onClick={() => {
                setModalType("presenters");
                setIsModalOpen(true);
              }}
            >
              <PlusIcon/>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 space-y-5 w-full h-full overflow-auto relative">
            <h2 className="text-xl font-bold">
              {modalType === "presenters" ? "إضافة مقدم" : "إضافة منظم"}
            </h2>
            {/* <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full px-4 py-2 border rounded-md outline-none"
              name={modalType === "presenters" ? "" : ""}
            /> */}
            <SearchUser addUser={handleAddUser} />
            {modalError && <p className="text-red-500 text-sm">{modalError}</p>}
            <div className="flex gap-3 absolute bottom-5">
              <Button onClick={() => setIsModalOpen(false)}>إلغاء</Button>
              {/* <Button gradient onClick={handleAddUser} disabled={loading}>
                {loading ? "جاري الإضافة..." : "إضافة"}
              </Button> */}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error.message && (
        <p className="text-red-500 text-center mt-5">
          حدث خطأ, الرجاء المحاولة مره اخرى.
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="w-full grid place-items-center">
        <LoadingWrapper>
          <div className="flex flex-row-reverse justify-between w-full mt-10">
            <Button gradient className="">
              تنسيق الفعالية
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                prevStepHandler();
              }}
              className="!px-10"
            >
              السابق
            </Button>
          </div>
        </LoadingWrapper>
      </div>
    </CreateEventCard>
  );
}
