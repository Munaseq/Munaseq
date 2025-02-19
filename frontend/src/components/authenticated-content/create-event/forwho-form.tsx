// "use client";

// import Image from "next/image";
// import tagIcon from "@/assets/icons/tag-gradient.svg";
// import CreateEventCard from "./create-event-card";
// import { Input } from "@/components/common/shadcn-ui/input";
// import Button from "@/components/common/button";
// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import Catagory from "@/components/common/category";
// import AddCatagoryDropdown from "@/components/common/add-category-dropdown";
// import LoadingWrapper from "@/components/common/loading-wrapper";

// export default function forwhoForm({
//   onCategoriesChange,
//   step,
//   prevStepHandler,
//   error,
// }: Readonly<{
//   onCategoriesChange: (categories: string[]) => void;
//   step: number;
//   prevStepHandler: () => void;
//   error: { message: string };
// }>) {
//   const [selectedCatagories, setSelectedCatagories] = useState([] as string[]);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
//   const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false); // State for moderator modal visibility
//   const [presenterName, setPresenterName] = useState(""); // State for presenter's name
//   const [moderatorName, setModeratorName] = useState(""); // State for moderator's name
//   const [presenters, setPresenters] = useState<string[]>([]); // List of presenters
//   const [moderators, setModerators] = useState<string[]>([]); // List of moderators
//   useEffect(() => {
//     onCategoriesChange(selectedCatagories);
//   }, [selectedCatagories]);

//   // Function to open the presenter modal
//   const openPresenterModal = () => {
//     setIsModalOpen(true);
//   };

//   // Function to close the presenter modal
//   const closePresenterModal = () => {
//     setIsModalOpen(false);
//   };

//   // Function to open the moderator modal
//   const openModeratorModal = () => {
//     setIsModeratorModalOpen(true);
//   };

//   // Function to close the moderator modal
//   const closeModeratorModal = () => {
//     setIsModeratorModalOpen(false);
//   };

//   // Function to add presenter
//   const addPresenter = () => {
//     if (presenterName.trim() !== "") {
//       setPresenters((prev) => [...prev, presenterName]);
//       setPresenterName(""); // Reset the input field
//       closePresenterModal(); // Close modal after adding the presenter
//     }
//   };

//   // Function to add moderator
//   const addModerator = () => {
//     if (moderatorName.trim() !== "") {
//       setModerators((prev) => [...prev, moderatorName]);
//       setModeratorName(""); // Reset the input field
//       closeModeratorModal(); // Close modal after adding the moderator
//     }
//   };

//   return (
//     <CreateEventCard actual={step} goal={4}>
//       <h1 className="flex items-center gap-2 font-bold text-xl">
//         <Image src={tagIcon} alt="puzzle icon" />
//         لمن توجه اليه الفعالية
//       </h1>
//       <motion.div layout className="flex flex-wrap gap-2 mt-2">
//         {selectedCatagories.map((category) => (
//           <Catagory
//             onClick={() => {
//               if (selectedCatagories.length === 1) {
//                 return;
//               }
//               setSelectedCatagories((prevState) => {
//                 return prevState.filter((t) => t !== category);
//               });
//             }}
//             selected={selectedCatagories.includes(category)}
//             checked
//             active
//             key={category}
//           >
//             {category}
//           </Catagory>
//         ))}
//         <motion.div layout className="grid place-items-center">
//           {selectedCatagories.length < 3 && (
//             <AddCatagoryDropdown
//               onCatagorySelect={(catagory: string) => {
//                 if (selectedCatagories.includes(catagory)) {
//                   return;
//                 }
//                 setSelectedCatagories((prevState) => [...prevState, catagory]);
//               }}
//             />
//           )}
//         </motion.div>
//       </motion.div>

//       {/* Presenter Section */}
//       <div className="mt-5">
//         <label className="block text-lg text-custom-gray">
//           مقدمين الفعالية التعليمية
//         </label>
//         <div className="flex items-center gap-2 mt-2">
//           <button
//             onClick={openPresenterModal}
//             className="bg-custom-gray text-white p-2 rounded-full"
//           >
//             {/* Replace with your custom image */}
//             <Image src={tagIcon} alt="Add Presenter" width={20} height={20} />
//           </button>
//         </div>
//         {presenters.length > 0 && (
//           <ul className="mt-3 list-disc pl-5">
//             {presenters.map((presenter, index) => (
//               <li key={index}>{presenter}</li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Moderator Section */}
//       <div className="mt-5">
//         <label className="block text-lg text-custom-gray">
//           منظمين الفعالية التعليمية
//         </label>
//         <div className="flex items-center gap-2 mt-2">
//           <button
//             onClick={openModeratorModal}
//             className="bg-custom-gray text-white p-2 rounded-full"
//           >
//             {/* Replace with your custom image */}
//             <Image src={tagIcon} alt="Add Moderator" width={20} height={20} />
//           </button>
//         </div>
//         {moderators.length > 0 && (
//           <ul className="mt-3 list-disc pl-5">
//             {moderators.map((moderator, index) => (
//               <li key={index}>{moderator}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <LoadingWrapper>
//         <div className="flex flex-row-reverse justify-between w-full mt-10">
//           <Button gradient className="">
//             الخطوة التالية
//           </Button>
//           <Button
//             onClick={(e) => {
//               e.preventDefault();
//               prevStepHandler();
//             }}
//             className="!px-10"
//           >
//             السابق
//           </Button>
//         </div>
//       </LoadingWrapper>

//       {/* Modal for Adding Moderator */}
//       {isModeratorModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-5 rounded-md w-96">
//             <h2 className="font-bold text-xl mb-3">إضافة منظم</h2>
//             <Input
//               placeholder="اسم المنظم"
//               value={moderatorName}
//               onChange={(e) => setModeratorName(e.target.value)}
//             />
//             <div className="mt-5 flex justify-between">
//               <Button onClick={addModerator} gradient>
//                 إضافة
//               </Button>
//               <Button onClick={closeModeratorModal} className="!px-10">
//                 إغلاق
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </CreateEventCard>
//   );
// }

"use client";

import Image from "next/image";
import tagIcon from "@/assets/icons/tag-gradient.svg";
import plusIcon from "@/assets/icons/plus-circle.svg";
import userIcon from "@/assets/icons/user-black.svg";

import CreateEventCard from "./create-event-card";
import Button from "@/components/common/buttons/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingWrapper from "@/components/common/loading-wrapper";
import Catagory from "@/components/common/category";
import AddCatagoryDropdown from "@/components/common/buttons/add-category-dropdown";
import getUserAction from "@/proxy/user/get-user-using-username-action";
import { UserDataDto } from "@/dtos/user-data.dto";

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
  const [selectedCatagories, setSelectedCatagories] = useState([] as string[]);
  const [presenters, setPresenters] = useState([] as UserDataDto[]);
  const [moderators, setModerators] = useState([] as UserDataDto[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"presenters" | "moderators">(
    "presenters"
  );
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    onCategoriesChange(selectedCatagories);
  }, [selectedCatagories]);

  const handleAddUser = async () => {
    setLoading(true);
    setModalError("");
    const user = await getUserAction(username);
    setLoading(false);

    if (!user) {
      setModalError("المستخدم غير موجود");
      return;
    }
    // method call
    onRoleChange({ assignedUserId: user.id, role: modalType });
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

    setUsername("");
    setIsModalOpen(false);
  };

  return (
    <CreateEventCard actual={step} goal={4}>
      <h1 className="flex items-center gap-2 font-bold text-xl">
        <Image src={tagIcon} alt="puzzle icon" />
        لمن توجه اليه الفعالية
      </h1>
      {/* Category Selection Section */}
      <motion.div layout className="flex flex-wrap gap-2 mt-2">
        {selectedCatagories.map((category) => (
          <Catagory
            onClick={() => {
              if (selectedCatagories.length === 1) {
                return;
              }
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
          </Catagory>
        ))}
        <motion.div layout className="grid place-items-center">
          {selectedCatagories.length < 3 && (
            <AddCatagoryDropdown
              onCatagorySelect={(catagory: string) => {
                if (selectedCatagories.includes(catagory)) {
                  return;
                }
                setSelectedCatagories((prevState) => [...prevState, catagory]);
              }}
            />
          )}
        </motion.div>
      </motion.div>

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
              <Image
                src={presenter.profilePictureUrl || userIcon}
                alt={presenter.visibleName || presenter.username}
                layout="fill"
                objectFit="cover"
              />
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
              <Image src={plusIcon} alt="Add presenters" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Moderators Section */}
      <div className="mt-5">
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
              <Image
                src={moderator.profilePictureUrl || userIcon}
                alt={moderator.visibleName || moderator.username}
                layout="fill"
                objectFit="cover"
              />
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
              <Image src={plusIcon} alt="Add moderators" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 space-y-5 w-96">
            <h2 className="text-xl font-bold">
              {modalType === "presenters" ? "إضافة مقدم" : "إضافة منظم"}
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full px-4 py-2 border rounded-md outline-none"
              name={modalType === "presenters" ? "" : ""}
            />
            {modalError && <p className="text-red-500 text-sm">{modalError}</p>}
            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsModalOpen(false)}>إلغاء</Button>
              <Button gradient onClick={handleAddUser} disabled={loading}>
                {loading ? "جاري الإضافة..." : "إضافة"}
              </Button>
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
