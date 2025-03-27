"use client";
// import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!", {
      description: "We'll get back to you soon.",
    });
    console.log(values);
  }

  return (
    <>
      <div
        className="relative w-[98%] my-4 mx-auto bg-cover bg-center bg-no-repeat rounded-3xl h-[96vh] sm:h-[75vh] md:h-[96vh] flex justify-center items-center"
        style={{
          backgroundImage: "url('/adminportal/loginbackgroundimg.svg')",
        }}
      >
        <div className="flex flex-col justify-center items-center text-center w-full p-4">
          <Image
            src="/adminportal/wwah.svg"
            alt="WWAH Logo"
            width={130}
            height={130}
            className=" mb-4"
          />

          <h4>Forget Password!</h4>
          <p className="w-full md:w-[45%] xl:w-[25%]">
            Please enter your registered email address below to initiate
            password reset request.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full md:w-[60%] lg:w-[40%] xl:w-[30%] mt-4"
            >
              {/* Email Field */}
              <div className="flex flex-col text-start">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Enter your email address"
                            className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
                            {...field}
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Image
                              src="/adminportal/letter.svg"
                              alt="User Icon"
                              width={20}
                              height={20}
                              className="w-5 h-5 text-black"
                            />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* OTP Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-lg text-base"
              >
                <Link href="/adminportal/verifyotp">Send OTP</Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
