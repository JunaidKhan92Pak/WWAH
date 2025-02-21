"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";
import { Plus } from "lucide-react";
import Image from "next/image"; // Added missing import

const formSchema = z.object({
  familyMembers: z.array(
    z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      relationship: z.string().min(2, "Relationship is required"),
      nationality: z.string().min(2, "Nationality is required"),
      occupation: z.string().min(2, "Occupation is required"),
      email: z.string().email("Invalid email address"),
      phoneCountry: z.string(),
      phoneNumber: z.string().min(5, "Phone number is required"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function FamilyMembers() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyMembers: [
        {
          name: "",
          relationship: "",
          nationality: "",
          occupation: "",
          email: "",
          phoneCountry: "US",
          phoneNumber: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "familyMembers",
    control: form.control,
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <div className="p-4">
      <div className=" mx-auto max-w-3xl">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-white space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl className="bg-[#f1f1f1] text-black">
                          <Input className="placeholder:text-sm" placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormMessage />

                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship with the student</FormLabel>
                        <FormControl className="bg-[#f1f1f1] text-black">
                          <Input className="placeholder:text-sm" placeholder="Enter Relationship" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.nationality`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="bg-[#f1f1f1] text-black">
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                  <span className="text-lg">{country.flag}</span>
                                  {country.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.occupation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl className="bg-[#f1f1f1]">
                          <Input className="placeholder:text-sm" placeholder="Enter Occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl className="bg-[#f1f1f1]">
                          <Input
                            type="email"
                            className="placeholder:text-sm"
                            placeholder="Enter your email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.phoneNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone No.</FormLabel>
                        <div className="flex">
                          <FormField
                            control={form.control}
                            name={`familyMembers.${index}.phoneCountry`}
                            render={({ field: countryField }) => (
                              <Select
                                onValueChange={countryField.onChange}
                                defaultValue={countryField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-r-none border-r-0">
                                    <SelectValue>
                                      <div className="flex items-center gap-2">
                                        <Image
                                          src={
                                            countries.find(
                                              (c) => c.code === countryField.value
                                            )?.flag || countries[0].flag
                                          }
                                          alt="Country Flag"
                                          width={20}
                                          height={20}
                                          className="object-contain"
                                          unoptimized
                                        />
                                        <span className="text-sm">
                                          {countryField.value}
                                        </span>
                                      </div>
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      <div className="flex items-center gap-2">
                                        <Image
                                          src={country.flag}
                                          alt={`${country.name} Flag`}
                                          width={20}
                                          height={20}
                                          className="object-contain"
                                          unoptimized
                                        />
                                        <span className="text-sm">{`${country.code} (${country.name})`}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <Input
                            {...field}
                            className="rounded-l-none bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
                onClick={() =>
                  append({
                    name: "",
                    relationship: "",
                    nationality: "",
                    occupation: "",
                    email: "",
                    phoneCountry: "US",
                    phoneNumber: "",
                  })
                }
              >
                <Plus className="w-4 h-4" />
                Add Family Member
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
