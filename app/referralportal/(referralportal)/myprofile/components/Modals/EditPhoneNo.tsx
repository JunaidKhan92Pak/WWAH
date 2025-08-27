"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  // FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRefUserStore } from "@/store/useRefDataStore";

const formSchema = z.object({
  phone: z
    .string()
    .min(10, "Invalid contact number")
    .refine((val) => !isNaN(Number(val)), "Phone must be a valid number"),
});

export default function EditPhone({
  phone,
  updatedAt,
}: {
  phone: number;
  updatedAt: string;
}) {
  console.log("Updated At:", updatedAt);

  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserProfile } = useRefUserStore();
  // console.log(updatedAt, "updatedAt");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: phone?.toString() || "",
    },
  });
  // console.log(phone, "phone");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, "values");
    try {
      setIsSubmitting(true);
      const phoneNumber = Number(values.phone);
      const response = await updateUserProfile({ phone: phoneNumber });
      console.log(response, "response from updateUserProfile");
      setSuccessOpen(true);
      setOpen(false);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <div className="flex flex-col space-y-2">
        <p className="text-gray-600 text-base">Phone</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on {new Date(updatedAt).toLocaleDateString("en-GB")}
          </p>
          <Image
            src="/DashboardPage/pen.svg"
            alt="Edit"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Phone</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> */}
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <div className="relative">
                  {/* Image inside input */}
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Image
                      src="/DashboardPage/User.svg"
                      alt="user"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  {/* Input with fallback value */}
                  <Input
                    {...form.register("phone")}
                    className="pl-10 rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm truncate"
                    placeholder="Enter your phone no"
                    type="number"
                  />
                </div>
                <FormMessage />
              </FormItem>
              <Button type="submit" className="w-full md:w-[40%] bg-[#C7161E]">
                {isSubmitting ? "Updating..." : "Update Phone Number"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Personal Info Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
