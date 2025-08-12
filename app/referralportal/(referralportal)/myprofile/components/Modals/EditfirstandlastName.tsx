"use client";

import { useState, FC, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/useUserData";

const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

interface EditfirstandlastNameProps {
  firstName: string;
  lastName: string;
}

const EditfirstandlastName: FC<EditfirstandlastNameProps> = ({
  firstName,
  lastName,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserProfile, user, getLastUpdatedDate, loading, error } =
    useUserStore();

  const form = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName, lastName },
  });

  // Update form values when props change (when user data is updated)
  useEffect(() => {
    form.reset({ firstName, lastName });
  }, [firstName, lastName, form]);

  async function onSubmit(values: z.infer<typeof nameSchema>) {
    // console.log(values, "values");
    setIsSubmitting(true);

    try {
      const success = await updateUserProfile(values);
      if (success) {
        setConfirmOpen(true);
        // Auto-close after 2 seconds
        setTimeout(() => {
          setConfirmOpen(false);
          setOpen(false);
          setIsSubmitting(false);
        }, 2000);
      } else {
        // Handle error case
        console.error("Failed to update profile");
        alert("Failed to update profile. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  // Get the current user data from store (this will be updated after successful API call)
  const currentFirstName = user?.firstName || firstName;
  const currentLastName = user?.lastName || lastName;
  const lastUpdated = getLastUpdatedDate();

  return (
    <>
      {/* First Name */}
      <div className="flex flex-col space-y-2">
        <p className="text-gray-600 text-base">First Name:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={16}
            height={16}
          />
          <p className="text-sm">{currentFirstName}</p>
          <Image
            src="/DashboardPage/pen.svg"
            alt="Edit"
            width={18}
            height={18}
            className="cursor-pointer ml-10"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Last Name */}
      <div className="flex flex-col space-y-2">
        <p className="text-gray-600 text-base">Last Name:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={16}
            height={16}
          />
          <p className="text-sm">{currentLastName}</p>
        </div>
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="flex flex-col space-y-2">
          <p className="text-gray-500 text-xs">Last updated: {lastUpdated}</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit First & Last Name</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      placeholder="First Name"
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      disabled={isSubmitting || loading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      disabled={isSubmitting || loading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full md:w-[30%] bg-[#C7161E]"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Updating..." : "Update Name"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Name Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditfirstandlastName;
