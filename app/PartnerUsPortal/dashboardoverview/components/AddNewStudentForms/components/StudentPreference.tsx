"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

const countries = [
  "United Kingdom", "United States", "Australia", "Canada",
  "Ireland", "New Zealand", "China", "Italy",
  "Malaysia", "France", "Denmark", "Germany",
];

const degreeLevels = [
  "Foundation", "Bachelors", "Pre Master", "Master", "PhD", "Diploma", "Certificate",
];

const trackinginformation = [
  "Google", "Social Media", "Friends/Family", "Educational Fair/Event", "Advirtisement", "Another Agent or Consultant"
]



export default function StudentPreferenceForm() {
 
  const { control } = useFormContext();

  return (
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Student Preference
        </h2>

        {/* Country + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Preferred Country */}
          <FormField
            control={control}
            name="preferredCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Preferred Country for studying abroad
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-sm bg-[#f1f1f1] border px-4 py-2"
                    >
                      <span>
                        {field.value || "Select a country"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 shadow-md bg-white">
                    {countries.map((country) => (
                      <div
                        key={country}
                        className="gap-12 flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                        onClick={() => field.onChange(country)}
                      >
                        <span className="text-sm text-gray-800">{country}</span>
                        <Checkbox
                          checked={field.value === country}
                          className="pointer-events-none"
                        />
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preferred City */}
          <FormField
            control={control}
            name="preferredCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Preferred City
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="newyork">New York</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="toronto">Toronto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Degree + Field of Study */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Degree Level */}
          <FormField
            control={control}
            name="degreeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Which degree level are you interested in?
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-sm bg-[#f1f1f1] border px-4 py-2"
                    >
                      <span>
                        {field.value || "Select degree level"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 shadow-md bg-white">
                    {degreeLevels.map((level) => (
                      <div
                        key={level}
                        className="flex items-center gap-12 justify-between px-4 py-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-100 transition-colors"
                        onClick={() => field.onChange(level)}
                      >
                        <span className="text-sm text-gray-800">{level}</span>
                        <Checkbox
                          checked={field.value === level}
                          className="pointer-events-none"
                        />
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field of Study */}
          <FormField
            control={control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Field of Study
                </FormLabel>
                <FormControl>
                  <Input placeholder="Write..."
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Study Mode */}
        <FormField
          control={control}
          name="studyMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Study Mode</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#f1f1f1]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="on-campus">On Campus</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tuition and Living Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Tuition Budget */}
          <div className="grid grid-cols-5 gap-2 items-end">
            <FormField
              control={control}
              name="tuitionCurrency"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">Tuition Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1]">
                        <SelectValue placeholder="PKR" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PKR">PKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tuitionBudget"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 500000"
                      className="bg-[#f1f1f1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Living Budget */}
          <div className="grid grid-cols-5 gap-2 items-end">
            <FormField
              control={control}
              name="livingCurrency"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">Living Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1]">
                        <SelectValue placeholder="PKR" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PKR">PKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="livingBudget"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 300000"
                      className="bg-[#f1f1f1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
          
          <h2 className="text-center text-2xl font-semibold text-gray-800">
          Student Tracking Information
        </h2>

        <FormField
                    control={control}
                    name="trackinginfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
How did the student hear about us?
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-sm bg-[#f1f1f1] border px-4 py-2"
                            >
                              <span>
                                {field.value || "Select"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 shadow-md bg-white">
                            {trackinginformation.map((info) => (
                              <div
                                key={info}
                                className="flex items-center gap-12  justify-between px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                                onClick={() => field.onChange(info)}
                              >
                                <span className="text-sm text-gray-800">{info}</span>
                                <Checkbox
                                  checked={field.value === info}
                                  className="pointer-events-none"
                                />
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
          
     
      </div>
  );
}
