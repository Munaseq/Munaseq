"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button";
import followUserAction from "@/proxy/user/follow-user-action";
import unfollowUserAction from "@/proxy/user/unfollow-user-action";
import getFollowingUsersAction from "@/proxy/user/get-following-users";
import getFollowersUsersAction from "@/proxy/user/get-followers-users-action";

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  // Check if the user is already followed when component mounts
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const followingUsers = await getFollowingUsersAction();
        const isUserFollowed = followingUsers.some(
          (user: any) => user.id === userId
        );
        setIsFollowed(isUserFollowed);
      } catch (error) {
        console.error("Failed to check follow status:", error);
      }
    };

    checkFollowStatus();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowed) {
        await unfollowUserAction(userId);
      } else {
        await followUserAction(userId);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error during follow action:", error);
    }
  };

  return (
    <Button className="mt-2" gradient={!isFollowed} onClick={handleFollowToggle}>
      {isFollowed ? "إلغاء المتابعة" : "تابع"}
    </Button>
  );
}
