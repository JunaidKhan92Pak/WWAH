"use client"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { z } from "zod"
import type { formSchema } from "./Schema"

type FormValues = z.infer<typeof formSchema>

const getScoreOptions = (testType: string) => {
  switch (testType) {
    case "ielts":
      // IELTS scores from 0.0 to 9.0 in 0.5 increments
      return Array.from({ length: 19 }, (_, i) => (i * 0.5).toFixed(1))
    case "pte":
      // PTE scores from 10 to 90
      return Array.from({ length: 81 }, (_, i) => (i + 10).toString())
    case "toefl":
      // TOEFL iBT scores from 0 to 120
      return Array.from({ length: 121 }, (_, i) => i.toString())
    case "duolingo":
      // Duolingo scores from 10 to 160 in increments of 5
      return Array.from({ length: 31 }, (_, i) => (10 + i * 5).toString())
    case "cambridge":
      // Cambridge scores from 1 to 9
      return Array.from({ length: 9 }, (_, i) => (i + 1).toString())
    default:
      return []
  }
}

const LanguageProficiency = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const selectedTest = form.watch("proficiencyTest")
  const scoreOptions = getScoreOptions(selectedTest || "")

  return (
    <div className="flex flex-col my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        {/* <FormField
          control={form.control}
          name="proficiencyLevel"
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
        /> */}
        <FormField
          control={form.control}
          name="proficiencyTest"
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
                    <SelectItem value="planning">I am planning to take one</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overAllScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Score:</FormLabel>
              <FormControl>
                {selectedTest && scoreOptions.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder="Select test first..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    disabled
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="listeningScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Listening:</FormLabel>
              <FormControl>
                {selectedTest && scoreOptions.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder="Select test first..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    disabled
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="writingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Writing:</FormLabel>
              <FormControl>
                {selectedTest && scoreOptions.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder="Select test first..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    disabled
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="readingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Reading:</FormLabel>
              <FormControl>
                {selectedTest && scoreOptions.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder="Select test first..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    disabled
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="speakingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Speaking:</FormLabel>
              <FormControl>
                {selectedTest && scoreOptions.length > 0 ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                    <SelectContent>
                      {scoreOptions.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder="Select test first..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    disabled
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default LanguageProficiency
