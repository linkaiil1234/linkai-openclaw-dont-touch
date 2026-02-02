"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useGetTasksByClientId,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/api/crm/task";
import { TTask } from "@/types/models/task";
import CustomerMetaCard from "@/components/customers/customer-meta-card";
import CustomerInfoCard from "@/components/customers/customer-info-card";
import CustomerChannelsCard from "@/components/customers/customer-channels-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreVertical, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/query-client";
import { useGetClientById, useUpdateClient } from "@/hooks/api/crm/client";
import { TClient } from "@/types/models/client";
import { useForm, Controller } from "react-hook-form";
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
import Image from "next/image";

// Transform TClient to Customer type expected by components
const transformClientToDisplay = (client: TClient) => {
  return {
    id: client.contact_id?.toString() || client._id,
    name: client.name || client.username || "Unknown",
    email: client.email || "No email",
    thumbnail: client.thumbnail || "",
    status: client.status === "online" ? "Active" : "Inactive",
    spending: 0,
    channels: client.channel ? [client.channel.toLowerCase()] : [],
    phone: client.phone || undefined,
    location: undefined,
  };
};

// Zod schema for edit client form
const editClientSchema = z.object({
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
  username: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "online", "offline"]).optional(),
  language: z.string().optional().or(z.literal("")),
  thumbnail: z.instanceof(File).optional(),
});

type EditClientFormData = z.infer<typeof editClientSchema>;

export default function CustomerPage() {
  const { _id } = useParams<{ _id: string }>();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] =
    useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  // Fetch client by ID
  const {
    data: clientResponse,
    isLoading,
    isError,
  } = useGetClientById({ _id: _id || "" }, { enabled: !!_id });

  const clientData = clientResponse?.data;

  // Edit client form
  const editForm = useForm<EditClientFormData>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      username: "",
      status: undefined,
      language: "",
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
  } = editForm;

  const thumbnailFile = watch("thumbnail");

  // Update form when client data is loaded
  useEffect(() => {
    if (clientData && isEditCustomerDialogOpen) {
      reset({
        name: clientData.name || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        username: clientData.username || "",
        status:
          (clientData.status as "active" | "inactive" | "online" | "offline") ||
          undefined,
        language: clientData.language || "",
        thumbnail: undefined,
      });
      if (clientData.thumbnail) {
        setImagePreview(clientData.thumbnail);
        setThumbnailUrl(clientData.thumbnail);
      } else {
        setImagePreview(null);
        setThumbnailUrl("");
      }
    }
  }, [clientData, isEditCustomerDialogOpen, reset]);

  // Image upload handler
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

  // Update client mutation
  const { mutate: updateClient, isPending: isUpdatingClient } = useUpdateClient(
    {
      onSuccess: () => {
        toast.success("Customer updated successfully");
        setIsEditCustomerDialogOpen(false);
        invalidateQueries({
          queryKey: ["useGetClientById", { _id: _id || "" }],
        });
        invalidateQueries({
          queryKey: ["useGetAllClients"],
        });
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
          "Failed to update customer. Please try again.";
        toast.error(errorMessage);
      },
    },
  );

  const handleEditSubmit = (data: EditClientFormData) => {
    if (!clientData || !_id) return;

    // Convert File to base64 if thumbnail is uploaded
    let thumbnailBase64 = clientData.thumbnail || "";
    if (thumbnailUrl && thumbnailUrl.startsWith("data:")) {
      thumbnailBase64 = thumbnailUrl;
    }

    const updateData: TClient = {
      ...clientData,
      name: data.name.trim(),
      email: data.email && data.email.trim() ? data.email.trim() : undefined,
      phone: data.phone && data.phone.trim() ? data.phone.trim() : undefined,
      username:
        data.username && data.username.trim()
          ? data.username.trim()
          : undefined,
      status: data.status || clientData.status,
      language:
        data.language && data.language.trim()
          ? data.language.trim()
          : undefined,
      thumbnail: thumbnailBase64 || undefined,
    };

    updateClient({
      client_id: _id,
      data: updateData,
    });
  };

  const handleCloseEditDialog = () => {
    reset();
    setImagePreview(null);
    setThumbnailUrl("");
    setIsEditCustomerDialogOpen(false);
  };

  // Fetch tasks for this client
  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasksByClientId({ client_id: _id || "" }, { enabled: !!_id });

  // Task mutations
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask({
    onSuccess: () => {
      toast.success("Task created successfully");
      setIsAddTaskDialogOpen(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      invalidateQueries({
        queryKey: ["useGetTasksByClientId", { client_id: _id || "" }],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  const { mutate: updateTask } = useUpdateTask({
    onSuccess: () => {
      toast.success("Task updated successfully");
      refetchTasks();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  const { mutate: deleteTask } = useDeleteTask({
    onSuccess: () => {
      toast.success("Task deleted successfully");
      refetchTasks();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  const tasks = tasksData?.data || [];
  const openTasks = tasks.filter((task) => !task.is_completed);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!_id) return;

    createTask({
      client_id: _id,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      is_completed: false,
    });
  };

  const handleToggleTask = (task: TTask) => {
    updateTask({
      _id: task._id,
      is_completed: !task.is_completed,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask({ _id: taskId });
  };

  const getRelativeTime = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Date unknown";
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-6 bg-transparent"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        <div className="rounded-2xl border bg-card p-5 lg:p-6">
          <Skeleton className="h-6 w-48 mb-5 lg:mb-7" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !clientData) {
    return (
      <div
        className="flex flex-col gap-6 bg-transparent"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        <div className="rounded-2xl border bg-card p-5 lg:p-6">
          <p className="text-sm text-muted-foreground">
            {isError ? "Failed to load customer" : "Customer not found"}
          </p>
        </div>
      </div>
    );
  }

  const customer = transformClientToDisplay(clientData);

  return (
    <div
      className="flex flex-col gap-6 bg-transparent"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Customer Details */}
      <div className="rounded-2xl border bg-card p-5 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground lg:mb-7">
          Customer Details
        </h3>
        <div className="space-y-6">
          <CustomerMetaCard
            customer={customer}
            onEdit={() => setIsEditCustomerDialogOpen(true)}
          />
          <CustomerInfoCard customer={customer} />
          <CustomerChannelsCard customer={customer} />

          {/* Additional Customer Data */}
          <div className="p-5 border rounded-2xl lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-foreground mb-6">
                  Additional Information
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-muted-foreground">
                      Contact ID
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {clientData.contact_id}
                    </p>
                  </div>

                  {clientData.phone && (
                    <div>
                      <p className="mb-2 text-xs leading-normal text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {clientData.phone}
                      </p>
                    </div>
                  )}

                  {clientData.username && (
                    <div>
                      <p className="mb-2 text-xs leading-normal text-muted-foreground">
                        Username
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {clientData.username}
                      </p>
                    </div>
                  )}

                  {clientData.language && (
                    <div>
                      <p className="mb-2 text-xs leading-normal text-muted-foreground">
                        Language
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {clientData.language.toUpperCase()}
                      </p>
                    </div>
                  )}

                  {clientData.last_activity && (
                    <div>
                      <p className="mb-2 text-xs leading-normal text-muted-foreground">
                        Last Activity
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDistanceToNow(
                          new Date(clientData.last_activity),
                          {
                            addSuffix: true,
                          },
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 text-xs leading-normal text-muted-foreground">
                      Status
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {clientData.status === "Active" ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="rounded-2xl border bg-card p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
            {!isLoadingTasks && (
              <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                {openTasks.length} open
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddTaskDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {isLoadingTasks ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              No tasks yet. Click &ldquo;Add&rdquo; to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border transition-colors hover:bg-muted/50",
                  task.is_completed && "opacity-60",
                )}
              >
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={() => handleToggleTask(task)}
                  className="mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium text-foreground",
                      task.is_completed && "line-through text-muted-foreground",
                    )}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(task.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      task.is_completed ? "bg-green-500" : "bg-orange-500",
                    )}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Task Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreatingTask) {
                    handleCreateTask();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Task Description
              </label>
              <Input
                placeholder="Enter task description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreatingTask) {
                    handleCreateTask();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddTaskDialogOpen(false)}
              disabled={isCreatingTask}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={isCreatingTask}
              className="cursor-pointer"
            >
              {isCreatingTask ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog
        open={isEditCustomerDialogOpen}
        onOpenChange={setIsEditCustomerDialogOpen}
      >
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
                  Edit Customer
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update customer information
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleEditSubmit)}>
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
                        <AvatarImage
                          src={imagePreview}
                          alt="Customer preview"
                        />
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
                                {Math.round((thumbnailFile?.size || 0) / 1024)}{" "}
                                KB
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
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              className="size-5"
                            />
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
                      htmlFor="edit-customer-name"
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
                        id="edit-customer-name"
                        placeholder="e.g., John Doe"
                        {...register("name")}
                        className={cn(
                          "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                          errors.name &&
                            "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                        )}
                        disabled={isUpdatingClient}
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
                      htmlFor="edit-customer-email"
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
                        id="edit-customer-email"
                        type="email"
                        placeholder="e.g., john.doe@example.com"
                        {...register("email")}
                        className={cn(
                          "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                          errors.email &&
                            "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                        )}
                        disabled={isUpdatingClient}
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
                      htmlFor="edit-customer-phone"
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
                        id="edit-customer-phone"
                        type="tel"
                        placeholder="e.g., +1234567890"
                        {...register("phone")}
                        className={cn(
                          "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                          errors.phone &&
                            "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                        )}
                        disabled={isUpdatingClient}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="edit-customer-username"
                      className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <HugeiconsIcon
                        icon={UserIcon}
                        className="size-4 text-gray-600"
                        strokeWidth={2}
                      />
                      Username{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <div className="relative group">
                      <Input
                        id="edit-customer-username"
                        placeholder="e.g., johndoe123"
                        {...register("username")}
                        className={cn(
                          "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                          errors.username &&
                            "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                        )}
                        disabled={isUpdatingClient}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2.5">
                      <Label
                        htmlFor="edit-customer-status"
                        className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                      >
                        Status{" "}
                        <span className="text-gray-400 font-normal text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Controller
                        name="status"
                        control={editForm.control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) =>
                              field.onChange(
                                value
                                  ? (value as
                                      | "active"
                                      | "inactive"
                                      | "online"
                                      | "offline")
                                  : undefined,
                              )
                            }
                            disabled={isUpdatingClient}
                          >
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label
                        htmlFor="edit-customer-language"
                        className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                      >
                        Language{" "}
                        <span className="text-gray-400 font-normal text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <div className="relative group">
                        <Input
                          id="edit-customer-language"
                          placeholder="e.g., en"
                          {...register("language")}
                          className={cn(
                            "h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus-visible:ring-4 focus-visible:ring-gray-900/10 focus-visible:border-gray-900 transition-all duration-300 group-hover:border-gray-300",
                            errors.language &&
                              "border-red-300 focus-visible:ring-red-500/10 focus-visible:border-red-500",
                          )}
                          disabled={isUpdatingClient}
                        />
                      </div>
                      {errors.language && (
                        <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          {errors.language.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t-2 border-linear-to-r from-transparent via-gray-200 to-transparent">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditDialog}
                  disabled={isUpdatingClient}
                  className="min-w-32 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingClient}
                  className="relative min-w-40 h-12 rounded-xl bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 font-semibold shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isUpdatingClient ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="size-5"
                        strokeWidth={2.5}
                      />
                      <span>Update Customer</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
