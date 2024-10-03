"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfileAvatar({ userId = null }) {
  const [profileImage, setProfileImage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      const profileImageResponse = await fetch(
        "/api/users/image" + (userId ? "?id=" + userId : ""),
        {
          method: "GET",
        }
      );

      const status = profileImageResponse.status;

      if (status === 200) {
        const profileImage = await profileImageResponse.text();

        setProfileImage(profileImage);
      }

      setIsLoading(false);
    }, 0);

    return () => clearTimeout(disposeableTimeout);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  if (!profileImage) return;

  return (
    <Avatar>
      <AvatarImage
        className="object-cover"
        src={profileImage ?? ""}
        alt="Kalimbu Software"
      />
      <AvatarFallback className="bg-transparent">3rEco</AvatarFallback>
    </Avatar>
  );
}
