'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Plus,Trash } from 'lucide-react'

// Validation schema for one experience
const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, 'Required'),
  organization: z.string().min(1, 'Required'),
  fullTime: z.boolean().optional(),
  partTime: z.boolean().optional(),
  dateFrom: z.string().min(1, 'Required'),
  dateTo: z.string().min(1, 'Required')
}).refine(data => data.fullTime || data.partTime, {
  message: 'Select at least one work type',
  path: ['fullTime']
})

// Form schema for multiple experiences
const formSchema = z.object({
  experiences: z.array(workExperienceSchema).nonempty()
})

type FormValues = z.infer<typeof formSchema>

export default function WorkExperienceForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences: []
    }
  })

  // Get remove method from useFieldArray to delete an experience
 const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: 'experiences'
})


  // Add one initial experience block if none exists
  useEffect(() => {
    const existingExperiences = form.getValues('experiences')
    if (!existingExperiences || existingExperiences.length === 0) {
      append({
        jobTitle: '',
        organization: '',
        fullTime: false,
        partTime: false,
        dateFrom: '',
        dateTo: ''
      })
    }
  }, [append, form])



  return (
    <Form {...form} >
      <div>

        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <div className="absolute top-2 right-2">
          {index !== 0 && (
  <Button
    variant="destructive"
    size="icon"
    type="button"
    onClick={() => remove(index)}
  >
    <Trash className="w-4 h-4" />
  </Button>
)}


            </div>

            <h2 className="text-center text-lg font-semibold my-6 border p-4 rounded-md">
              Work Experience {index + 1}
            </h2>

            <FormField
              control={form.control}
              name={`experiences.${index}.jobTitle`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." className="bg-[#f1f1f1]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {/* Organization Input */}
  <FormField
    control={form.control}
    name={`experiences.${index}.organization`}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Organization</FormLabel>
        <FormControl>
          <Input placeholder="Write..." className="bg-[#f1f1f1]" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Full Time Checkbox styled like input without label */}
  <div className='grid grid-cols-2 gap-2'>
  <FormField
    control={form.control}
    name={`experiences.${index}.fullTime`}
    render={({ field }) => (
      <FormItem className="flex flex-col justify-end">
        <FormControl>
          <div className="flex items-center space-x-2 border rounded-md bg-[#f1f1f1] px-4 py-2 h-10">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id={`fullTime-${index}`}
            />
            <label htmlFor={`fullTime-${index}`} className="cursor-pointer text-sm">
              Full Time
            </label>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Part Time Checkbox styled like input without label */}
  <FormField
    control={form.control}
    name={`experiences.${index}.partTime`}
    render={({ field }) => (
      <FormItem className="flex flex-col justify-end">
        <FormControl>
          <div className="flex items-center space-x-2 border rounded-md bg-[#f1f1f1] px-4 py-2 h-10">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id={`partTime-${index}`}
            />
            <label htmlFor={`partTime-${index}`} className="cursor-pointer text-sm">
              Part Time
            </label>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  </div>
</div>



            {form.formState.errors.experiences?.[index]?.fullTime && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.experiences[index]?.fullTime?.message}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <FormField
                control={form.control}
                name={`experiences.${index}.dateFrom`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date From</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-[#f1f1f1]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.dateTo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date To</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-[#f1f1f1]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4">

        <Button
          type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
onClick={() =>
            append({
              jobTitle: '',
              organization: '',
              fullTime: false,
              partTime: false,
              dateFrom: '',
              dateTo: ''
            })
          }
        >
           <Plus className="w-4 h-11" /> Add Work Experience
        </Button>
        </div>

     
      </div>
    </Form>
  )
}
