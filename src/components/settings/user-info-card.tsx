"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Edit02Icon,
  ImageAddIcon,
  Delete02Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { useUpdateUser, useGetUser } from "@/hooks/api/user";
import { invalidateQueries } from "@/lib/query-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import Image from "next/image";

const userInfoSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  avatar: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type UserInfoFormValues = z.infer<typeof userInfoSchema>;

export default function UserInfoCard() {
  const { session, refreshSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string>("");

  // Fetch user data from API
  const { data: userData, refetch: refetchUser } = useGetUser(
    { _id: session.user?._id || "" },
    {
      enabled: !!session.user?._id,
    },
  );

  const form = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: "",
      avatar: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  const { mutate: updateUser, isPending: isSaving } = useUpdateUser({
    onSuccess: async (response) => {
      toast.success(
        response.message || "Personal information updated successfully",
      );
      // Invalidate and refetch user data
      await invalidateQueries({ queryKey: ["useGetUser", session.user?._id] });
      refetchUser();
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error saving personal information:", error);
      toast.error(error.message || "Failed to update personal information");
    },
  });

  // Load user data from API or session
  useEffect(() => {
    const user = userData?.data || session.user;
    if (user) {
      const avatar = user.avatar || "";
      form.reset({
        name: user.name || "",
        avatar: avatar,
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      // Set image preview if avatar exists
      if (avatar) {
        setImagePreview(avatar);
        setAvatarBase64(avatar);
      } else {
        setImagePreview(null);
        setAvatarBase64("");
      }
    }
  }, [userData, session.user, form]);

  // Handle image file upload and convert to base64
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setAvatarBase64(result);
          form.setValue("avatar", result, { shouldValidate: true });
        };
        reader.readAsDataURL(file);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const handleRemoveImage = () => {
    setImagePreview(null);
    setAvatarBase64("");
    form.setValue("avatar", "", { shouldValidate: true });
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset image preview when dialog closes
      const user = userData?.data || session.user;
      const avatar = user?.avatar || "";
      if (avatar) {
        setImagePreview(avatar);
        setAvatarBase64(avatar);
      } else {
        setImagePreview(null);
        setAvatarBase64("");
      }
    }
  };

  const onSubmit = (values: UserInfoFormValues) => {
    if (!session.user?._id) {
      toast.error("User ID not found");
      return;
    }

    // Use base64 avatar if available, otherwise use form value
    const avatarToSend = avatarBase64 || values.avatar || "";

    // Update local session
    const updatedUser = {
      ...session.user,
      name: values.name,
      phone: values.phone,
      bio: values.bio,
      avatar: avatarToSend,
    };
    refreshSession(updatedUser);

    // Call API to update user profile with proper params structure
    updateUser({
      _id: session.user._id,
      payload: {
        avatar: avatarToSend,
        name: values.name,
        phone: values.phone,
        bio: values.bio,
      },
    });
  };

  const watchedValues = form.watch();

  return (
    <>
      <div className="p-5 border rounded-2xl lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground mb-6">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Name
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.name || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Email address
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.email || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Phone
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.phone || "-"}
                </p>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Bio
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.bio || "-"}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="w-full lg:w-auto rounded-full shrink-0"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Edit Personal Information...
            </DialogTitle>
            <DialogDescription>
              Update your details to keep your profile up-to-date.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-3">
                {/* Avatar Upload Section */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={() => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Avatar Preview */}
                          <div className="flex items-start gap-6">
                            <div className="shrink-0 group relative">
                              <Avatar className="size-20 border-2 border-gray-200 shadow-sm">
                                {imagePreview ? (
                                  <AvatarImage
                                    src={imagePreview}
                                    alt="Profile preview"
                                  />
                                ) : (
                                  <AvatarFallback className="bg-gray-100">
                                    <HugeiconsIcon
                                      icon={User02Icon}
                                      className="size-8 text-gray-400"
                                      strokeWidth={1.5}
                                    />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            </div>

                            {/* Upload Area */}
                            <div className="flex-1">
                              {!imagePreview ? (
                                <div
                                  {...getRootProps()}
                                  className={cn(
                                    "relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-300",
                                    isDragActive
                                      ? "border-primary bg-primary/5"
                                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50",
                                  )}
                                >
                                  <input {...getInputProps()} />
                                  <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                      <HugeiconsIcon
                                        icon={ImageAddIcon}
                                        className="size-6 text-gray-600"
                                        strokeWidth={2}
                                      />
                                    </div>
                                    <div className="text-center space-y-1">
                                      <p className="text-sm font-medium text-gray-800">
                                        {isDragActive
                                          ? "Drop your image here"
                                          : "Click to upload or drag and drop"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 5MB
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="flex items-center gap-4">
                                    {imagePreview && (
                                      <div className="relative size-16 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                          src={imagePreview}
                                          alt="Preview"
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        Image uploaded
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Click to change or remove
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02Icon}
                                        className="size-4"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled
                          className="border bg-muted"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+1 234 567 890"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us about yourself..."
                          className="border min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
