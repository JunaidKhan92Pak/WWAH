"use client";

import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import {
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
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./Schema";
import countrie from "world-countries";

type FormValues = z.infer<typeof formSchema>;

const StandardizedTest = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { fields, append, remove } = useFieldArray({
    name: "familyMembers",
    control: form.control,
  });

  // ✅ Ensure at least one family member field exists on initial load
  useEffect(() => {
    const members = form.getValues("familyMembers");
    if (!members || members.length === 0) {
      append({
        name: "",
        relationship: "",
        nationality: "",
        occupation: "",
        email: "",
        countryCode: "",
        phoneNo: "",
      });
    }
  }, [append, form]);
  const nationalityOptions = countrie.map((c) => ({
    label: c.demonyms?.eng?.m || c.name.common,
    value: c.demonyms?.eng?.m || c.name.common,
  }));
  return (
    <div className="my-4">
      {fields.map((field, index) => (
        <div key={field.id} className=" p-4 rounded-md relative mb-4">
          <div className="border rounded-lg p-3 mb-2">
            <div className="absolute  top-6 right-6">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <h2 className="text-base font-semibold text-center text-gray-900 mb-2">
              Family Member {index + 1}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl className="bg-[#f1f1f1]">
                    <Input
                      placeholder="Enter Name"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.relationship`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl className="bg-[#f1f1f1]">
                    <Input
                      placeholder="Enter Relationship"
                      {...field}
                      value={field.value || ""}
                    />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {nationalityOptions.map((option, key) => (
                        <SelectItem key={key} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Occupation */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.occupation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl className="bg-[#f1f1f1]">
                    <Input
                      placeholder="Enter Occupation"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="bg-[#f1f1f1]">
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.phoneNo`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No.</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`familyMembers.${index}.countryCode`}
                      render={({ field: countryCodeField }) => (
                        <Select
                          value={countryCodeField.value || "+92-Pakistan"}
                          onValueChange={countryCodeField.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={
                                      (countries.find(
                                        (c) =>
                                          `${c.code}-${c.name}` === countryCodeField.value
                                      ) ||
                                        countries.find(
                                          (c) => `${c.code}-${c.name}` === "+92-Pakistan"
                                        )
                                      )?.flag || "/default-flag.png"
                                    }
                                    alt="Country Flag"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="text-sm">












                                    {(countryCodeField.value || "+92-Pakistan").split("-")[0]}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => {
                              const fullValue = `${country.code}-${country.name}`;
                              return (
                                <SelectItem key={fullValue} value={fullValue}>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={country.flag}
                                      alt={`${country.name} Flag`}
                                      width={20}
                                      height={20}
                                    />
                                    <span className="text-sm">{`${country.code} (${country.name})`}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter your phone number"
                      className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] text-sm"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      {/* Add Family Member Button */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-3xl bg-[#f1f1f1] "
          onClick={() =>
            append({
              name: "",
              relationship: "",
              nationality: "",
              occupation: "",
              email: "",
              countryCode: "+92",
              phoneNo: "",
            })
          }
        >
          <Plus className="w-4 h-11" />
          Add Family Member
        </Button>
      </div>
    </div>
  );
};

export default StandardizedTest;
