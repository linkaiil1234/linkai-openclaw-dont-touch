"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import {
  User02Icon,
  ImageAddIcon,
  Delete02Icon,
  Mail01Icon,
  CallIcon,
  UserIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useCreateClient } from "@/hooks/api/crm/client";
import { cn } from "@/lib/utils";
import { invalidateQueries } from "@/lib/query-client";

// Zod schema matching TCreateClientData
const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone must be in E.164 format (e.g., +1234567890)",
    )
    .optional()
    .or(z.literal("")),
  thumbnail: z.instanceof(File).optional(),
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCustomerDialog({
  open,
  onOpenChange,
}: NewCustomerDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      thumbnail: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;
  const thumbnailFile = watch("thumbnail");

  const { mutate: createClient, isPending } = useCreateClient({
    onSuccess: () => {
      toast.success("Customer added successfully!");
      handleClose();
      invalidateQueries({ queryKey: ["useGetAllClients"] });
    },
    onError: (error: unknown) => {
      const errorObj = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        errorObj?.response?.data?.message ||
        errorObj?.response?.data?.error ||
        errorObj?.message ||
        "Failed to add customer. Please try again.";
      toast.error(errorMessage);
    },
  });

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

        setValue("thumbnail", file, { shouldValidate: true });

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setThumbnailUrl(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const handleRemoveImage = () => {
    setValue("thumbnail", undefined);
    setImagePreview(null);
    setThumbnailUrl("");
  };

  const onSubmit = (data: CreateClientFormData) => {
    const payload: {
      name: string;
      email?: string;
      phone?: string;
      thumbnail?: string;
    } = {
      name: data.name.trim(),
    };

    // Only include email if it's not empty
    if (data.email && data.email.trim()) {
      payload.email = data.email.trim();
    }

    // Only include phone if it's not empty
    if (data.phone && data.phone.trim()) {
      payload.phone = data.phone.trim();
    }

    // Only include thumbnail if it exists
    if (thumbnailUrl) {
      // payload.thumbnail = thumbnailUrl;
      payload.thumbnail = "https://via.placeholder.com/150";
    }

    createClient(payload);
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setThumbnailUrl("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      reset();
      setImagePreview(null);
      setThumbnailUrl("");
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl w-full max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-linear-to-br from-white via-gray-50/30 to-white">
        <DialogHeader className="space-y-3 pb-6 border-b border-linear-to-r from-transparent via-gray-200 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-900/20">
              <HugeiconsIcon
                icon={UserIcon}
                className="size-6 text-white"
                strokeWidth={2}
              />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                Add New Customer
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                Create a new customer profile
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-gray-400 to-gray-600"></span>
              Profile Picture{" "}
              <span className="text-gray-400 font-normal text-xs">
                (Optional)
              </span>
            </Label>
            <div className="flex items-start gap-6">
              {/* Avatar Preview */}
              <div className="shrink-0 group relative">
                <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-gray-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <Avatar className="size-28 border-4 border-white shadow-xl shadow-gray-900/10 ring-2 ring-gray-100 transition-all duration-300 group-hover:scale-105">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Customer preview" />
                  ) : (
                    <AvatarFallback className="bg-linear-to-br from-gray-100 via-gray-50 to-gray-100">
                      <HugeiconsIcon
                        icon={User02Icon}
                        className="size-12 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
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
                      "relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 group overflow-hidden",
                      isDragActive
                        ? "border-gray-900 bg-linear-to-br from-gray-900/5 via-gray-600/5 to-gray-900/5 scale-[1.02]"
                        : "border-gray-200 hover:border-gray-400 hover:bg-linear-to-br hover:from-gray-50 hover:to-white",
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="absolute inset-0 bg-linear-to-br from-gray-900/0 via-gray-600/0 to-gray-900/0 group-hover:from-gray-900/5 group-hover:via-gray-600/5 group-hover:to-gray-900/5 transition-all duration-500"></div>
                    <div className="relative flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <HugeiconsIcon
                            icon={ImageAddIcon}
                            className="size-7 text-white"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div className="text-center space-y-1.5">
                        <p className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {isDragActive
                            ? "Drop your image here"
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          PNG, JPG, GIF up to 5MB
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-200 rounded-2xl p-5 bg-linear-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-5">
                      {imagePreview && (
                        <div className="relative size-20 rounded-xl overflow-hidden border-2 border-white shadow-lg shadow-gray-900/10 ring-2 ring-gray-100">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-linear-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {thumbnailFile?.name || "Image"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {Math.round((thumbnailFile?.size || 0) / 1024)} KB
                          </span>
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            className="size-3 text-green-600"
                          />
                          <span className="text-green-600 font-medium">
                            Uploaded
                          </span>
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-gray-300"></div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-gray-900 to-gray-700 shadow-lg shadow-gray-900/20">
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="size-4 text-white"
                    strokeWidth={2}
                  />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Personal Information
                  </h3>
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-300 via-gray-300 to-transparent"></div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="customer-name"
                  className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="size-4 text-gray-600"
                    strokeWidth={2}
                  />
                  Full Name{" "}
                  <span className="text-red-500 font-semibold">*</span>
                </Label>
                <div className="relative group">
                  <Input
                    id="customer-name"
                    placeholder="e.g., John Doe"
                    {...register("name")}
                    className={cn(
                      "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                      errors.name &&
                        "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                    )}
                    disabled={isPending}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="customer-email"
                  className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="size-4 text-gray-600"
                    strokeWidth={2}
                  />
                  Email Address{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (Optional)
                  </span>
                </Label>
                <div className="relative group">
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="e.g., john.doe@example.com"
                    {...register("email")}
                    className={cn(
                      "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                      errors.email &&
                        "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                    )}
                    disabled={isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="customer-phone"
                  className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                >
                  <HugeiconsIcon
                    icon={CallIcon}
                    className="size-4 text-gray-600"
                    strokeWidth={2}
                  />
                  Phone Number{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (Optional, e.g. +919876543210)
                  </span>
                </Label>
                <div className="relative group">
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="e.g., +1234567890"
                    {...register("phone")}
                    className={cn(
                      "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                      errors.phone &&
                        "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                    )}
                    disabled={isPending}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t-2 border-linear-to-r from-transparent via-gray-200 to-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="min-w-32 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              className="relative min-w-40 h-12 rounded-xl bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 font-semibold shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  <span>Creating...</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-5"
                    strokeWidth={2.5}
                  />
                  <span>Create Customer</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
