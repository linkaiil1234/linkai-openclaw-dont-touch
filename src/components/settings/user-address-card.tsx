"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit02Icon } from "@hugeicons/core-free-icons";
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

const addressSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  tax_id: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function UserAddressCard() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch user data from API
  const { data: userData, refetch: refetchUser } = useGetUser(
    { _id: session.user?._id || "" },
    {
      enabled: !!session.user?._id,
    },
  );

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      state: "",
      zip: "",
      tax_id: "",
    },
  });

  const { mutate: updateUser, isPending: isSaving } = useUpdateUser({
    onSuccess: async (response) => {
      toast.success(
        response.message || "Address information updated successfully",
      );
      // Invalidate and refetch user data
      await invalidateQueries({ queryKey: ["useGetUser", session.user?._id] });
      refetchUser();
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error saving address information:", error);
      toast.error(error.message || "Failed to update address information");
    },
  });

  // Load user data from API or session
  useEffect(() => {
    const user = userData?.data || session.user;
    if (user?.address) {
      form.reset({
        name: user.name || "",
        country: user.address.country || "",
        city: user.address.city || "",
        state: user.address.state || "",
        zip: user.address.zip || "",
        tax_id: user.address.tax_id || "",
      });
    }
  }, [userData, session.user, form]);

  const onSubmit = (values: AddressFormValues) => {
    if (!session.user?._id) {
      toast.error("User ID not found");
      return;
    }

    // Call API to update address information with proper params structure
    updateUser({
      _id: session.user._id,
      payload: {
        name: values.name,
        address: values,
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
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Country
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.country || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  City/State
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.city && watchedValues.state
                    ? `${watchedValues.city}, ${watchedValues.state}`
                    : watchedValues.city || watchedValues.state || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.zip || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  TAX ID
                </p>
                <p className="text-sm font-medium text-foreground">
                  {watchedValues.tax_id || "-"}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Address</DialogTitle>
            <DialogDescription>
              Update your address details to keep your profile up-to-date.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your country"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your city"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your state"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter postal code"
                          className="border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>TAX ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your tax ID (optional)"
                          className="border"
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
                  onClick={() => setIsOpen(false)}
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
