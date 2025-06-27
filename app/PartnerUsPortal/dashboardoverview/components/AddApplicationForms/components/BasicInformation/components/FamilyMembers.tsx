"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";

import { countries } from "@/lib/countries";

// Schema
const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nationality: z.string().min(1, "Nationality is required"),
  stillAlive1: z.string().optional(),
  institution: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
  occupation: z.string().optional(),
  stillAlive2: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNo: z.string().min(1, "Phone number is required"),
});

const formSchema = z.object({
  familyMembers: z.array(familyMemberSchema).min(1, "At least one family member is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FamilyMembers = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyMembers: [
        {
          name: "",
          nationality: "",
          stillAlive1: "",
          institution: "",
          relationship: "",
          occupation: "",
          stillAlive2: "",
          email: "",
          countryCode: "+92-Pakistan",
          phoneNo: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "familyMembers",
    control: form.control,
  });

  useEffect(() => {
    const members = form.getValues("familyMembers");
    if (!members || members.length === 0) {
      append({
        name: "",
        nationality: "",
        stillAlive1: "",
        institution: "",
        relationship: "",
        occupation: "",
        stillAlive2: "",
        email: "",
        countryCode: "+92-Pakistan",
        phoneNo: "",
      });
    }
  }, [append, form]);

  return (
    <div className="my-6">
      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 relative">
          <div className="absolute top-4 right-4">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => fields.length > 1 && remove(index)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

<h2 className="text-xl font-semibold text-center mb-6 p-5 rounded-md  border">
  Family Member {index + 1}
</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" 
                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
 {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nationality */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.nationality`}
              render={({ field }) => {
                const selected = countries.find(c => `${c.code}-${c.name}` === field.value);
                return (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">

                          <SelectValue placeholder="Select Country">
                            {selected ? selected.name : "Select Country"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(country => {
                          const value = `${country.code}-${country.name}`;
                          return (
                            <SelectItem key={value} value={value}>
                              {country.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Still Alive 1 */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.stillAlive1`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Still Alive</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." 
                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                    {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Institution / Employer */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution / Employer</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." 
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

{...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Relationship */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.relationship`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship with the student</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." 
                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
 {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="Write..." 
                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
 {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Still Alive 2 */}
            <FormField
              control={form.control}
              name={`familyMembers.${index}.stillAlive2`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Still Alive</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." 
                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
 {...field} />
                  </FormControl>
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
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Image
                                  src="/DashboardPage/letter.svg"
                                  alt="Mail"
                                  width={18}
                                  height={18}
                                />
                              </span>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email address"
                                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                
                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
              )}
            />

            {/* Phone No. */}
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
                      render={({ field: ccField }) => (
                        <Select
                          value={ccField.value}
                          onValueChange={ccField.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg">
                              <SelectValue>
                                <div className="flex items-center gap-1">
                                  <Image
                                    src={
                                      countries.find(
                                        c => `${c.code}-${c.name}` === ccField.value
                                      )?.flag || "/default-flag.png"
                                    }
                                    alt="Flag"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="text-sm">{ccField.value?.split("-")[0]}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map(country => {
                              const fullValue = `${country.code}-${country.name}`;
                              return (
                                <SelectItem key={fullValue} value={fullValue}>
                                  <div className="flex items-center gap-2">
                                    <Image src={country.flag} alt="Flag" width={20} height={20} />
                                    <span>{`${country.code} (${country.name})`}</span>
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
                      placeholder="Enter your phone number"
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

/>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="flex gap-2 bg-[#f1f1f1] mt-4 rounded-3xl font-semibold"
        onClick={() =>
          append({
            name: "",
            nationality: "",
            stillAlive1: "",
            institution: "",
            relationship: "",
            occupation: "",
            stillAlive2: "",
            email: "",
            countryCode: "+92-Pakistan",
            phoneNo: "",
          })
        }
      >
        <Plus className="w-5 h-5" />
        Add Family Member
      </Button>
    </div>
  );
};

export default FamilyMembers;
