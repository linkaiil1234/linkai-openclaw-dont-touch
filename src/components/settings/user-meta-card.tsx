"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit02Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/custom/use-localstorage";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { InstagramIconGradient } from "@/constants/channel-icons";
import DemoUserProfileImage from "@/assets/images/demo-user-profile-image.avif";

type FormData = {
  name: string;
  bio: string;
  location: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  avatar?: string;
};

export default function UserMetaCard() {
  const { session, refreshSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { value: storedProfile, setValue: setStoredProfile } =
    useLocalStorage<FormData>(
      `user_profile_${session.user?._id || "default"}`,
      {
        name: "",
        bio: "",
        location: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        avatar: "",
      },
    );
  const [formData, setFormData] = useState<FormData>(storedProfile);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data from session and localStorage
  useEffect(() => {
    if (session.user) {
      const initialData: FormData = {
        name: storedProfile.name || session.user.name || "",
        bio: storedProfile.bio || "",
        location: storedProfile.location || "",
        facebook: storedProfile.facebook || "",
        twitter: storedProfile.twitter || "",
        linkedin: storedProfile.linkedin || "",
        instagram: storedProfile.instagram || "",
        avatar: storedProfile.avatar || session.user.avatar || "",
      };
      setFormData(initialData);
      setImagePreview(initialData.avatar || session.user.avatar || "");
    }
  }, [session.user, storedProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to format URLs
  const formatUrl = (url: string): string => {
    if (!url) return "";
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update user profile
      // If imageFile exists, upload it first, then update profile
      if (imageFile) {
        console.log("Image file to upload:", imageFile);
        // Here you would upload the image to your server/cloud storage
        // const imageUrl = await uploadImage(imageFile);
      }

      // Format URLs before saving
      const formattedData: FormData = {
        ...formData,
        facebook: formatUrl(formData.facebook),
        twitter: formatUrl(formData.twitter),
        linkedin: formatUrl(formData.linkedin),
        instagram: formatUrl(formData.instagram),
        avatar: imagePreview,
      };

      // Save to localStorage
      setStoredProfile(formattedData);
      setFormData(formattedData);

      // Update local session
      if (session.user) {
        const updatedUser = {
          ...session.user,
          name: formData.name,
          avatar: imagePreview,
        };
        refreshSession(updatedUser);
      }
      toast.success("Profile updated successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="p-5 border rounded-2xl lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border rounded-full bg-muted">
              {/* {imagePreview || formData.avatar ? (
                <Image
                  width={80}
                  height={80}
                  src={imagePreview || formData.avatar || session.user.avatar}
                  alt="pro"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                  <Image
                    width={80}
                    height={80}
                    src={DemoUserProfileImage}
                    alt="user"
                    className="w-full h-full object-contain p-1 "
                  />
                </div>
              )} */}
              {session?.user?.avatar ? (
                <img
                  src={session.user.avatar}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    console.error("Image failed to load:", session.user.avatar);
                    // Fallback to demo image
                    e.currentTarget.src = DemoUserProfileImage.src;
                  }}
                />
              ) : (
                <Image
                  src={DemoUserProfileImage}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-full"
                />
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-foreground xl:text-left">
                {formData.name || "User Name"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {formData.bio && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {formData.bio}
                    </p>
                    {formData.location && (
                      <div className="hidden h-3.5 w-px bg-border xl:block"></div>
                    )}
                  </>
                )}
                {formData.location && (
                  <p className="text-sm text-muted-foreground">
                    {formData.location}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {formData.facebook && formData.facebook.trim() && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={formatUrl(formData.facebook)}
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border bg-background text-sm font-medium shadow-sm hover:bg-accent transition-colors"
                  title="Facebook"
                  style={{ color: "#1877F2" }}
                >
                  <FaFacebookSquare size={20} />
                </a>
              )}

              {formData.twitter && formData.twitter.trim() && (
                <a
                  href={formatUrl(formData.twitter)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border bg-background text-sm font-medium shadow-sm hover:bg-accent transition-colors"
                  title="X (Twitter)"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                    style={{ color: "#000000" }}
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}

              {formData.linkedin && formData.linkedin.trim() && (
                <a
                  href={formatUrl(formData.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border bg-background text-sm font-medium shadow-sm hover:bg-accent transition-colors"
                  title="LinkedIn"
                  style={{ color: "#0077B5" }}
                >
                  <FaLinkedin size={20} />
                </a>
              )}

              {formData.instagram && formData.instagram.trim() && (
                <a
                  href={formatUrl(formData.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border bg-background text-sm font-medium shadow-sm hover:bg-accent transition-colors"
                  title="Instagram"
                >
                  <InstagramIconGradient size={20} />
                </a>
              )}
            </div>
          </div>
          {/* <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="w-full lg:w-auto rounded-full"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-4 mr-2" />
            Edit
          </Button> */}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
            <DialogDescription>
              Update your details to keep your profile up-to-date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-7">
            <div>
              <h5 className="mb-5 text-lg font-medium text-foreground">
                Profile Picture
              </h5>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 overflow-hidden border rounded-full bg-muted">
                  {imagePreview ? (
                    <Image
                      width={80}
                      height={80}
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                      {formData.name.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full"
                >
                  <HugeiconsIcon icon={Upload01Icon} className="size-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>

            <div>
              <h5 className="mb-5 text-lg font-medium text-foreground">
                Social Links
              </h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) =>
                      handleInputChange("facebook", e.target.value)
                    }
                    placeholder="https://www.facebook.com/username"
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>X.com (Twitter)</Label>
                  <Input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                    placeholder="https://x.com/username"
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Linkedin</Label>
                  <Input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) =>
                      handleInputChange("linkedin", e.target.value)
                    }
                    placeholder="https://www.linkedin.com/in/username"
                    className="border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) =>
                      handleInputChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/username"
                    className="border"
                  />
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-5 text-lg font-medium text-foreground">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="border"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    className="border bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Bio</Label>
                  <Input
                    type="text"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Enter your bio or job title"
                    className="border"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="City, State, Country"
                    className="border"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Close
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
