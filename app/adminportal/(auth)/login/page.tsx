"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!", {
      description: "We'll get back to you soon.",
    });
    console.log(values);
  }

  return (
    <>
      <div
        className="relative w-[98%] my-4 mx-auto bg-cover bg-center bg-no-repeat rounded-3xl h-[96vh]  md:h-[96vh] flex justify-center items-center"
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

          <h4>Welcome Back!</h4>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full md:w-[55%] lg:w-[40%] xl:w-[30%]"
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
                              src="/DashboardPage/letter.svg"
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

              {/* Password Field with Eye Icon */}
              <div className="flex flex-col text-start">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
                            {...field}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Image
                              src="/adminportal/key.svg"
                              alt="Password Icon"
                              width={20}
                              height={20}
                              className="w-4 h-4 text-black"
                            />
                          </span>
                          {/* Eye Icon for Toggle Password */}
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 text-gray-600" />
                            ) : (
                              <Eye className="w-5 h-5 text-gray-600" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="ml-2">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <Link
                  target="blank"
                  href="/adminportal/forgetpassword"
                  className="text-[#C06A17] text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white py-5 md:py-6 rounded-lg text-base"
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
