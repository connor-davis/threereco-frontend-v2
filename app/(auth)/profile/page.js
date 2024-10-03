"use client";

import LoadingSpinner from "@/components/loadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({});

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });

  const [profileImage, setProfileImage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      const profileImageResponse = await fetch("/api/users/image", {
        method: "GET",
      });

      const status = profileImageResponse.status;

      if (status === 200) {
        const profileImage = await profileImageResponse.text();

        setProfileImage(profileImage);
      }
      
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(disposeableTimeout);
  }, []);

  const onProfileSubmit = async (values) => {};

  const goBack = () => {
    const pathname = searchParams.get("redirect");

    return router.replace(pathname ?? "/");
  };

  const uploadProfileImage = async (file) => {
    const reader = new FileReader();

    reader.onload = async (reader) => {
      setProfileImage(reader.target.result);

      const uploadResponse = await fetch("/api/users/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        credentials: "include",
        body: JSON.stringify({ image: reader.target.result }),
      });

      const status = uploadResponse.status;

      if (status !== 200) {
        console.log(await uploadResponse.text());

        return toast.error("Error", {
          description: "Failed to upload image.",
          duration: 2000,
        });
      }

      return toast.success("Success", {
        description: "Profile successfully updated.",
        duration: 2000,
      });
    };
    reader.readAsDataURL(file);
  };

  if (isLoading)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full shadow-none max-w-96">
        <CardHeader>
          <CardTitle className="text-center">Your Profile</CardTitle>
          <CardDescription className="text-center">
            Manage your profile details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col w-full h-auto space-y-3">
                <Label>Profile Image</Label>

                <div className="flex items-center justify-center w-full h-auto">
                  {profileImage && (
                    <Avatar
                      className="max-w-[150px] w-full h-auto border hover:border-dashed hover:border-primary"
                      onClick={() =>
                        document.getElementById("image-select").click()
                      }
                    >
                      <AvatarImage
                        className="object-cover"
                        src={profileImage ?? ""}
                        alt="Kalimbu Software"
                      />
                      <AvatarFallback className="bg-transparent">
                        3rEco
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {!profileImage && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("image-select").click()
                      }
                    >
                      Select Image
                    </Button>
                  )}
                </div>

                <Input
                  id="image-select"
                  className="hidden"
                  type="file"
                  placeholder="Select an image..."
                  onChange={(event) =>
                    uploadProfileImage(event.target.files[0])
                  }
                />

                <Label className="text-sm text-muted-foreground">
                  Your 3rEco Profile Image
                </Label>
              </div>

              {/* <Button type="submit" className="w-full">
                Update Profile
              </Button> */}
            </form>
          </Form>

          <Button variant="outline" className="w-full" onClick={() => goBack()}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
