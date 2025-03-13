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
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog";
// Validation Schema
const formSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters."),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

const ResetPassword = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("Password Reset Successful:", data);
        setShowSuccessModal(true); // Show success modal
    };

    return (
        <div
            className="relative w-[98%] my-4 mx-auto bg-cover bg-center bg-no-repeat rounded-3xl h-[96vh]  md:h-[96vh] flex justify-center items-center"

        style={{ backgroundImage: "url('/adminportal/loginbackgroundimg.svg')" }}
        >
            <div className="flex flex-col justify-center items-center text-center w-full p-4">
                {/* Logo */}
                <Image
                    src="/adminportal/wwah.svg"
                    alt="WWAH Logo"
                    width={130}
                    height={130}
                    className="mb-4"
                />

                {/* Heading */}
                <h4>Reset Password!</h4>
                <p className="w-full md:w-[40%] xl:w-[20%]">Please enter your new password to secure your account.</p>

                {/* ✅ Wrap everything inside the <Form> component */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full md:w-[60%] lg:w-[40%] xl:w-[30%] mt-6">
                        <div className="flex flex-col text-start">

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"

                                                {...field}
                                            />
                                            {/* Key Icon */}
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

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"

                                                {...field}
                                            />
                                            {/* Key Icon */}
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
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
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

                        {/* Reset Password Button */}
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white py-5 md:py-6 rounded-lg text-base mt-6">
                            Reset my password
                        </Button>
                    </div>
                    </form>
                </Form>
            </div>
            {/* Success Modal (ShadCN Dialog) */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                       <DialogContent className="flex flex-col justify-center items-center  max-w-72 md:max-w-96 !rounded-3xl">
                         <Image src="/DashboardPage/success.svg" alt="Success" width={150} height={150} />
                         <DialogHeader>
                           <DialogTitle className="text-lg font-semibold text-gray-900">
                            Password Reset Successful!
                           </DialogTitle>
                         </DialogHeader>
                       </DialogContent>
                     </Dialog>

        </div>
    );
};

export default ResetPassword;
