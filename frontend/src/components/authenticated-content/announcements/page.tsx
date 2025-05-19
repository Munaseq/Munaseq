"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import sendAnnouncementAction from "@/proxy/announcements/send-announcement-action";
import { get } from "http";
import getAnnouncementAction from "@/proxy/announcements/get-announcement-action";
import { CircleUserRound } from "lucide-react";

export default function AnnouncementsPage({ announcements }: any) {
  const [showAnnouncements, setShowAnnouncements] = useState(announcements);

  const [newText, setNewText] = useState("");

  const handleSend = async () => {
    if (!newText.trim()) return;

    const error = await sendAnnouncementAction(newText);
    if (error !== undefined && error !== null) {
      console.error("Error sending Announcement:", error);
    }

    const newAnouncements = await getAnnouncementAction();
    if (error !== undefined && error !== null) {
      console.error("Error  :", error);
    }

    setShowAnnouncements(newAnouncements);
    setNewText("");
  };

  return (
    <div className="mx-auto p-4 flex flex-col gap-4">
      <div className="p-4 h-[550px] overflow-y-auto flex flex-col gap-4">
        {showAnnouncements.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-custom-gray text-lg">لا توجد اخبار متاحة</p>
          </div>
        ) : (
          showAnnouncements.map((announcement: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 border flex gap-4 items-start"
            >
              {announcement.user.profilePictureUrl === null ? (
                <CircleUserRound />
              ) : (
                <Image
                  src={announcement.user.profilePictureUrl}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {announcement.user.firstName} {announcement.user.lastName}
                </p>
                <p className="text-gray-700 mt-1">{announcement.user.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="اكتب خبراً..."
          className="flex-1 p-2 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
        />
        <Button onClick={handleSend} gradient>
          إرسال
        </Button>
      </div>
    </div>
  );
}
