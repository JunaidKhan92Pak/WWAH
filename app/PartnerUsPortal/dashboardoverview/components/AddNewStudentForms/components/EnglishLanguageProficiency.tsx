'use client'

import React from 'react'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useFormContext } from "react-hook-form";

// Validation schema



// Options
const englishProficiencyOptions = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Fluent',
  'Native Speaker',
]

const englishTestOptions = [
  'IELTS',
  'TOEFL',
  'PTE',
  'Duolingo',
  'Cambridge English',
]

const EnglishLanguageProficiency: React.FC = () => {

  const { control } = useFormContext();

  return (
        <div className='pt-4 space-y-4'>
      <h2 className="text-center text-xl font-semibold mb-4">English Language Proficiency</h2>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* English Proficiency Level */}
        <FormField
          control={control}
          name="englishProficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your English proficiency level?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='bg-[#f1f1f1]'>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {englishProficiencyOptions.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* English Test Taken */}
        <FormField
          control={control}
          name="englishTest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which English proficiency test have you taken?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} 
                >
                  <SelectTrigger className='bg-[#f1f1f1]'>
                    <SelectValue placeholder="Select English test"
                     />
                  </SelectTrigger>
                  <SelectContent>
                    {englishTestOptions.map((test) => (
                      <SelectItem key={test} value={test}>
                        {test}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
              </div>


        {/* Obtained Scores */}
        <FormField
          control={control}
          name="obtainedScores"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obtained Scores</FormLabel>
              <FormControl>
                <Input placeholder="Write..."
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                 {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  )
}

export default EnglishLanguageProficiency
