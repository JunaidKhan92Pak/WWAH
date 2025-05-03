"use client";

import { useState, FC } from "react";
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
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const form = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName, lastName },
  });

  async function onSubmit(values: z.infer<typeof nameSchema>) {
    console.log(values, "values");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updatePersonalInformation`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // setFirstName(values.firstName);
        // setLastName(values.lastName);
        setOpen(false);
        setTimeout(() => setConfirmOpen(true), 300);
      } else {
        console.error("Error updating:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

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
          <p className="text-sm">{firstName}</p>
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
          <p className="text-sm">{lastName}</p>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit First & Last Name</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...form.register("firstName")}
                placeholder="First Name"
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
              />

              <Input
                {...form.register("lastName")}
                placeholder="Last Name"
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
              />
              <Button type="submit" className="w-full md:w-[30%] bg-[#C7161E]">
                Update Name
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
