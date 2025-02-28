"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    country: z.string().min(1, {
        message: "Please select a country.",
    }),
    languageProficiency: z.string().min(1, { message: "Please select a proficiency level." }),
    languageTest: z.string().min(1, { message: "Please select a language proficiency test." }),
    overallScore: z
        .string()
        .refine((value) => /^[0-9]+(\.[0-9]+)?$/.test(value), {
            message: "Overall Score must be a valid number.",
        })
        .refine((value) => {
            const num = parseFloat(value);
            return num >= 0 && num <= 10;
        }, { message: "Overall Score must be between 0 and 10." }),
    scoreinlistening: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid score (e.g., 7.5, 8, 6.0)" })
        .refine((score) => parseFloat(score) >= 0 && parseFloat(score) <= 9, {
            message: "Score must be between 0 and 9",
        }),
    scoreinwriting: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid score (e.g., 7.5, 8, 6.0)" })
        .refine((score) => parseFloat(score) >= 0 && parseFloat(score) <= 9, {
            message: "Score must be between 0 and 9",
        }),
    scoreinreading: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid score (e.g., 7.5, 8, 6.0)" })
        .refine((score) => parseFloat(score) >= 0 && parseFloat(score) <= 9, {
            message: "Score must be between 0 and 9",
        }),
    scoreinspeaking: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid score (e.g., 7.5, 8, 6.0)" })
        .refine((score) => parseFloat(score) >= 0 && parseFloat(score) <= 9, {
            message: "Score must be between 0 and 9",
        }),

})

const LanguageProficiency = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country: "",
            languageProficiency: "",
            languageTest: "",
            overallScore: "",
            scoreinlistening: "",
            scoreinwriting: "",
            scoreinreading: "",
            scoreinspeaking: "",
        },
    })

    return (
        <div className="flex flex-col  my-4">

            <Form {...form}>
                <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        {/* Country Selector */}
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select the Country of study:</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="bg-[#f1f1f1]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usa">United States</SelectItem>
                                                <SelectItem value="canada">Canada</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                                <SelectItem value="germany">Germany</SelectItem>
                                                <SelectItem value="australia">Australia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="languageProficiency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What is your Language Proficiency Level?</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="bg-[#f1f1f1]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                                <SelectItem value="fluent">Fluent</SelectItem>
                                                <SelectItem value="native">Native Speaker</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="languageTest"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Which language proficiency test have you taken?</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="bg-[#f1f1f1]">
                                                <SelectValue placeholder="Select a test" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ielts">IELTS</SelectItem>
                                                <SelectItem value="toefl">TOEFL</SelectItem>
                                                <SelectItem value="pte">PTE</SelectItem>
                                                <SelectItem value="duolingo">Duolingo English Test</SelectItem>
                                                <SelectItem value="cambridge">Cambridge English Exam</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="overallScore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overall Score:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Write..."
                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scoreinlistening"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Score in Listening:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Write..."
                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scoreinwriting"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Score in Writing:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Write..."
                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scoreinreading"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Score in Reading:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Write..."
                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scoreinspeaking"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Score in Speaking:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Write..."
                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LanguageProficiency;

