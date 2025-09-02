
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import LanguageProficiency from "./components/LanguageProficiency"
import StandardizedTest from "./components/StandardizedTest"
import WorkExperience from "./components/WorkExperience"
import type { z } from "zod"
import { Form } from "@/components/ui/form"
import EducationalBackground from "./components/EducationalBackground"
import { toast } from "sonner"
import { formSchema } from "./components/Schema"
import { Button } from "@/components/ui/button"
import { getAuthToken } from "@/utils/authHelper"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSimpleFormPersistence } from "@/hooks/useFromPersistences"

const ApplicationInfo = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const totalPages = 4
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = getAuthToken()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      standardizedSubScore: ["", "", "", ""],
      educationalBackground: [],
      workExperience: [],
      // countryOfStudy: "",
      // nativeLanguage: "",
      // religion: "",
      proficiencyTest: undefined,
      overAllScore: "",
      listeningScore: "",
      readingScore: "",
      writingScore: "",
      speakingScore: "",
      standardizedTest: "",
      standardizedOverallScore: "",
    },
  })

  // Enhanced form persistence with server data loading
  const { clearSavedData, isDataLoaded } = useSimpleFormPersistence({
    key: "application-info-form",
    form,
    debounceMs: 1000,
  })

  // Handle page navigation from URL
  useEffect(() => {
    const stepParam = Number.parseInt(searchParams.get("step") || "1", 10)
    if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= totalPages) {
      setCurrentPage(stepParam)
    }
  }, [searchParams])

  // Save current page to sessionStorage
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("application-info-current-page", currentPage.toString())
    }
  }, [currentPage, isDataLoaded])

  // Restore current page from sessionStorage
  useEffect(() => {
    const savedPage = localStorage.getItem("application-info-current-page")
    if (savedPage && !isNaN(Number.parseInt(savedPage))) {
      const page = Number.parseInt(savedPage)
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setCurrentPage(page)
        router.replace(`/dashboard/completeapplication?tab=appinfo&step=${page}`, { scroll: false })
      }
    }
  }, [isDataLoaded])

  // Load server data on mount
  useEffect(() => {
    async function loadServerData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getApplicationInformation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        )

        if (res.ok) {
          const result = await res.json()
          if (result.success && result.data) {
            // Check if we have local data that's newer
            const localData = localStorage.getItem("application-info-form")

            if (!localData) {
              // No local data, use server data
              const data = result.data
              const formatted = {
                // primitive or string fields
                // countryOfStudy: data.countryOfStudy ?? "",
                nativeLanguage: data.nativeLanguage ?? "",
                religion: data.religion ?? "",

                // date-picker fields
                DOB: data.DOB ? new Date(data.DOB) : null,
                passportExpiryDate: data.passportExpiryDate ? new Date(data.passportExpiryDate) : null,
                oldPassportExpiryDate: data.oldPassportExpiryDate ? new Date(data.oldPassportExpiryDate) : null,
                visaExpiryDate: data.visaExpiryDate ? new Date(data.visaExpiryDate) : null,

                // educationalBackground → array of objects
                educationalBackground:
                  Array.isArray(data.educationalBackground) && data.educationalBackground.length
                    ? data.educationalBackground.map(
                      (bg: {
                        highestDegree?: string
                        subjectName?: string
                        institutionAttended?: string
                        marks?: string | number
                        degreeStartDate?: string | Date
                        degreeEndDate?: string | Date
                      }) => ({
                        highestDegree: bg.highestDegree || "",
                        subjectName: bg.subjectName || "",
                        institutionAttended: bg.institutionAttended || "",
                        marks: bg.marks ?? "",
                        degreeStartDate: bg.degreeStartDate
                          ? format(new Date(bg.degreeStartDate), "yyyy-MM-dd")
                          : undefined,
                        degreeEndDate: bg.degreeEndDate
                          ? format(new Date(bg.degreeEndDate), "yyyy-MM-dd")
                          : undefined,
                      }),
                    )
                    : [],

                // workExperience → array of objects
                workExperience:
                  Array.isArray(data.workExperience) && data.workExperience.length
                    ? data.workExperience.map(
                      (we: {
                        jobTitle?: string
                        organizationName?: string
                        employmentType?: string
                        from?: string | Date | null
                        to?: string | Date | null
                      }) => ({
                        jobTitle: we.jobTitle || "",
                        organizationName: we.organizationName || "",
                        employmentType: we.employmentType || "",
                        from: we.from ? new Date(we.from) : null,
                        to: we.to ? new Date(we.to) : null,
                      }),
                    )
                    : [],

                // language proficiency fields
                proficiencyTest: data.proficiencyTest ?? "",
                // proficiencyLevel: data.proficiencyLevel ?? "",
                overAllScore: data.overAllScore ?? "",
                listeningScore: data.listeningScore ?? "",
                readingScore: data.readingScore ?? "",
                writingScore: data.writingScore ?? "",
                speakingScore: data.speakingScore ?? "",

                // standardized test fields
                standardizedTest: data.standardizedTest ?? "",
                standardizedOverallScore: data.standardizedOverallScore ?? "",
                // ensure it's always an array of 4 strings
                standardizedSubScore:
                  Array.isArray(data.standardizedSubScore) && data.standardizedSubScore.length === 4
                    ? data.standardizedSubScore
                    : ["", "", "", ""],
              }

              form.reset(formatted)
              console.log("Loaded data from server")
            } else {
              console.log("Local data found, skipping server data")
            }
          }
        }
      } catch (err) {
        console.error("Failed to load server data", err)
      } finally {
        setIsLoading(false)
      }
    }

    // Only load server data if local data isn't already loaded
    if (!isDataLoaded) {
      loadServerData()
    } else {
      setIsLoading(false)
    }
  }, [form, token, isDataLoaded])

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationErrors([])

    console.log("Form submitted")
    const isValid = await form.trigger()

    if (isValid) {
      const formData = form.getValues()
      await onSubmit(formData)
    } else {
      const errors = form.formState.errors
      const errorMessages: string[] = []
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors]
        if (error?.message) {
          errorMessages.push(`${key}: ${error.message}`)
        }
      })
      setValidationErrors(errorMessages)
      toast.error("Please fix the form errors", {
        description: errorMessages.slice(0, 3).join(", "),
        duration: 5000,
      })
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submission started")
    try {
      setIsSubmitting(true)
      console.log("Form data:", data)

      // Create a formatted data object to match the expected API structure
      const formattedData = {
        ...data,
        educationalBackground: (data.educationalBackground ?? []).length > 0 ? data.educationalBackground : null,
        workExperience: (data.workExperience ?? []).length > 0 ? data.workExperience : null,
      }

      // Map educationalBackground to match schema if present
      if (data.educationalBackground && data.educationalBackground.length > 0) {
        formattedData.educationalBackground = data.educationalBackground.map((bg) => ({
          highestDegree: bg.highestDegree,
          subjectName: bg.subjectName,
          institutionAttended: bg.institutionAttended,
          marks: bg.marks,
          degreeStartDate: bg.degreeStartDate,
          degreeEndDate: bg.degreeEndDate,
          gradingType: bg.gradingType
        }))
      }

      // Map workExperience to match schema if present
      if (data.workExperience && data.workExperience.length > 0) {
        formattedData.workExperience = data.workExperience.map((exp) => ({
          jobTitle: exp.jobTitle,
          organizationName: exp.organizationName,
          employmentType: exp.employmentType,
          from: exp.from,
          to: exp.to,
        }))
      }

      // Make API request with formatted data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/applicationInformation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("API Response:", result)

      if (result.success) {
        toast.success("Application information saved successfully!")

        // Clear local data after successful submission
        clearSavedData()
        localStorage.removeItem("application-info-current-page")

        // Navigate to the next section
        router.push("/dashboard/completeapplication?tab=documents")
      } else {
        const errorMessage = result.message || "Failed to save information"
        toast.error(errorMessage, { duration: 5000 })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      let errorMessage = "An error occurred while saving your information"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(errorMessage, { duration: 6000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    router.replace(`/dashboard/completeapplication?tab=appinfo&step=${page}`, { scroll: false })
  }

  const handleNext = async () => {
    const currentPageIsValid = await validateCurrentPage()
    if (currentPageIsValid) {
      goToPage(Math.min(currentPage + 1, totalPages))
      setValidationErrors([])
    } else {
      const errors = form.formState.errors
      const errorMessages: string[] = []
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors]
        if (error?.message) {
          errorMessages.push(`${key}: ${error.message}`)
        }
      })
      setValidationErrors(errorMessages)
      toast.error("Please fix the errors on this page before continuing", {
        duration: 4000,
      })
    }
  }

  const handlePrevious = () => {
    goToPage(Math.max(currentPage - 1, 1))
    setValidationErrors([])
  }

  const validateCurrentPage = async () => {
    switch (currentPage) {
      case 1:
        return await form.trigger(["educationalBackground"])
      case 2:
        return await form.trigger(["workExperience"])
      case 3:
        return await form.trigger([
          // "countryOfStudy",
          // "proficiencyLevel",
          "proficiencyTest",
          "overAllScore",
          "listeningScore",
          "writingScore",
          "readingScore",
          "speakingScore",
        ])
      case 4:
        return await form.trigger(["standardizedTest", "standardizedOverallScore", "standardizedSubScore"])
      default:
        return true
    }
  }

  // Show loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading your application...</div>
  }

  // Use watch to observe form values
  const watchedValues = form.watch()
  console.log("Watched Values:", watchedValues)

  return (
    <div className="flex flex-col w-[90%] xl:w-[60%] mx-auto mt-6">
      {/* Dynamic Heading */}
      <h6 className="font-semibold text-center">
        {currentPage === 1 && "Educational Background"}
        {currentPage === 2 && "Work Experience"}
        {currentPage === 3 && "Language Proficiency"}
        {currentPage === 4 && "Standardized Test"}
      </h6>

      {/* Display validation errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-semibold mb-2">Please fill the following Info:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleFormSubmit}>
          {/* Multi-Step Form Content */}
          {currentPage === 1 && <EducationalBackground form={form} />}
          {currentPage === 2 && <WorkExperience form={form} />}
          {currentPage === 3 && <LanguageProficiency form={form} />}
          {currentPage === 4 && <StandardizedTest form={form} />}

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePrevious()
                  }}
                  className={`p-2 text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {/* Current Page Number */}
              <span className="px-4 py-2 text-sm font-semibold rounded-lg border">
                {currentPage} of {totalPages}
              </span>

              {/* Next Button */}
              {currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNext()
                    }}
                    className="p-2 text-sm"
                  >
                    Next
                  </PaginationNext>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          {/* Submit Button (Only on Last Page) */}
          {currentPage === totalPages && (
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                size="lg"
                className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

export default ApplicationInfo
