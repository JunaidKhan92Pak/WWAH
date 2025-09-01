"use client"

import type React from "react"
import { useEffect } from "react"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash } from "lucide-react"
import type { z } from "zod"
import { type formSchema, degreeTypes, type DegreeType } from "./Schema"

interface Props {
  form: UseFormReturn<z.infer<typeof formSchema>>
}

const EducationalBackground: React.FC<Props> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "educationalBackground",
    control: form.control,
  })

  // ✅ Ensure one entry is there on mount
  useEffect(() => {
    const background = form.getValues("educationalBackground")
    if (!background || background.length === 0) {
      append({
        highestDegree: "",
        subjectName: "",
        institutionAttended: "",
        gradingType: "", // Added gradingType field
        marks: "",
        degreeStartDate: undefined,
        degreeEndDate: undefined,
      })
    }
  }, [append, form])

  const getSubjectsForDegree = (degree: string): string[] => {
    return degreeTypes[degree as DegreeType]?.subjects ? Array.from(degreeTypes[degree as DegreeType].subjects) : []
  }

  const getGradingOptionsForDegree = (degree: string) => {
    return degreeTypes[degree as DegreeType]?.gradingOptions || []
  }

  const getGradingInfo = (degree: string, gradingType: string) => {
    const degreeInfo = degreeTypes[degree as DegreeType]
    const selectedOption = degreeInfo?.gradingOptions?.find((option) => option.value === gradingType)

    return {
      label: selectedOption?.label || degreeInfo?.gradingLabel || "CGPA/Marks",
      placeholder: selectedOption?.placeholder || degreeInfo?.gradingPlaceholder || "Write...",
    }
  }

  return (
    <div className="mx-auto max-w-3xl my-4">
      {fields.map((field, index) => {
        const selectedDegree = form.watch(`educationalBackground.${index}.highestDegree`)
        const selectedGradingType = form.watch(`educationalBackground.${index}.gradingType`)
        const subjects = getSubjectsForDegree(selectedDegree)
        const gradingOptions = getGradingOptionsForDegree(selectedDegree) // Get grading options
        const gradingInfo = getGradingInfo(selectedDegree, selectedGradingType) // Updated to use grading type

        return (
          <div key={field.id}>
            <div className="border p-4 rounded-md relative mb-4">
              {fields.length > 1 && (
                <div className="absolute top-2 right-2">
                  <Button variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <h2 className="text-base font-semibold text-center text-gray-900">Education Background {index + 1}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.highestDegree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{index === 0 ? "Highest Degree" : "Degree"}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset subject when degree changes
                        form.setValue(`educationalBackground.${index}.subjectName`, "")
                        // Reset grading type when degree changes
                        form.setValue(`educationalBackground.${index}.gradingType`, "")
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={index === 0 ? "Select Highest Degree" : "Select Degree"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(degreeTypes).map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
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
                name={`educationalBackground.${index}.subjectName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject/Field</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={Array.isArray(field.value) ? field.value[0] ?? "" : field.value}
                      disabled={!selectedDegree}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedDegree ? "Select Subject/Field" : "Select degree first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Institution */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.institutionAttended`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Attended</FormLabel>
                    <FormControl>
                      <Input {...field} className="placeholder:text-sm" placeholder="Write institution name..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grading Type */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.gradingType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grading System</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset marks when grading type changes
                        form.setValue(`educationalBackground.${index}.marks`, "")
                      }}
                      value={field.value}
                      disabled={!selectedDegree}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedDegree ? "Select grading system" : "Select degree first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name={`educationalBackground.${index}.marks`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{gradingInfo.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="placeholder:text-sm"
                        placeholder={gradingInfo.placeholder}
                        disabled={!selectedGradingType} // Disable until grading type is selected
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.degreeStartDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="YYYY/MM/DD"
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.degreeEndDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="YYYY/MM/DD"
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )
      })}

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
          onClick={() =>
            append({
              highestDegree: "",
              subjectName: "",
              institutionAttended: "",
              gradingType: "", // Added gradingType field to new entries
              marks: "",
              degreeStartDate: undefined,
              degreeEndDate: undefined,
            })
          }
        >
          <Plus className="w-4 h-4" /> Add Qualification
        </Button>
      </div>
    </div>
  )
}

export default EducationalBackground
