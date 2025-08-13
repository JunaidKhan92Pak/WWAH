"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LanguageProficiency from "./components/LanguageProficiency";
import StandardizedTest from "./components/StandardizedTest";
import WorkExperience from "./components/WorkExperience";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import EducationalBackground from "./components/EducationalBackground";
import { toast } from "sonner";
import { formSchema } from "./components/Schema";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/utils/authHelper";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ApplicationInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = 4;
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = getAuthToken();
  useEffect(() => {
    const stepParam = parseInt(searchParams.get("step") || "1", 10);
    if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= totalPages) {
      setCurrentPage(stepParam);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standardizedSubScore: ["", "", "", ""],
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
    form.handleSubmit(onSubmit)();
  };

  // ✅ Function to Handle Form Submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submission started");
    try {
      setIsSubmitting(true);
      console.log("Form data:", data);
      // Create a formatted data object to match the expected API structure
      const formattedData = {
        ...data,
        educationalBackground:
          (data.educationalBackground ?? []).length > 0
            ? data.educationalBackground
            : null,
        workExperience:
          (data.workExperience ?? []).length > 0 ? data.workExperience : null,
      };

      // Map educationalBackground to match schema if present
      if (data.educationalBackground && data.educationalBackground.length > 0) {
        formattedData.educationalBackground = data.educationalBackground.map(
          (bg) => ({
            highestDegree: bg.highestDegree,
            subjectName: bg.subjectName,
            institutionAttended: bg.institutionAttended,
            marks: bg.marks,
            degreeStartDate: bg.degreeStartDate,
            degreeEndDate: bg.degreeEndDate,
          })
        );
      }

      // Map workExperience to match schema if present
      if (data.workExperience && data.workExperience.length > 0) {
        formattedData.workExperience = data.workExperience.map((exp) => ({
          jobTitle: exp.jobTitle,
          organizationName: exp.organizationName,
          employmentType: exp.employmentType,
          from: exp.from,
          to: exp.to,
        }));
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
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        toast.success("Basic information saved successfully!");
        // If you have a router, uncomment this to navigate to the next page
        router.push("/dashboard/completeapplication?tab=documents");

      } else {
        toast.error(result.message || "Failed to save information");
      }
    } catch (error) {
      console.error(`Error submitting form:`, error);
      toast.error("An error occurred while saving your information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const currentPageIsValid = await validateCurrentPage();
    if (currentPageIsValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const validateCurrentPage = async () => {
    switch (currentPage) {
      case 1:
        return await form.trigger(["educationalBackground"]);
      case 2:
        return await form.trigger(["workExperience"]);
      case 3:
        return await form.trigger([
          "countryOfStudy",
          "proficiencyLevel",
          "proficiencyTest",
          "overAllScore",
          "listeningScore",
          "writingScore",
          "readingScore",
          "speakingScore",
        ]);
      case 4:
        return await form.trigger([
          "standardizedTest",
          "standardizedOverallScore",
          "standardizedSubScore",
        ]);
      default:
        return true;
    }
  };

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getApplicationInformation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data) {
          const data = result.data;
          // ─── Build a `formatted` object matching your zod schema exactly ───
          const formatted = {
            // primitive or string fields
            countryOfStudy: data.countryOfStudy ?? "",
            nativeLanguage: data.nativeLanguage ?? "",
            religion: data.religion ?? "",

            // date‐picker fields (React Hook Form with <Input type="date"> etc.)
            DOB: data.DOB ? new Date(data.DOB) : null,
            passportExpiryDate: data.passportExpiryDate
              ? new Date(data.passportExpiryDate)
              : null,
            oldPassportExpiryDate: data.oldPassportExpiryDate
              ? new Date(data.oldPassportExpiryDate)
              : null,
            visaExpiryDate: data.visaExpiryDate
              ? new Date(data.visaExpiryDate)
              : null,

            // educationalBackground → array of objects
            educationalBackground:
              Array.isArray(data.educationalBackground) && data.educationalBackground.length
                ? data.educationalBackground.map((bg: {
                  highestDegree?: string;
                  subjectName?: string;
                  institutionAttended?: string;
                  marks?: string | number;
                  degreeStartDate?: string | Date
                  degreeEndDate?: string | Date
                }) => ({
                  highestDegree: bg.highestDegree || "",
                  subjectName: bg.subjectName || "",
                  institutionAttended: bg.institutionAttended || "",
                  marks: bg.marks ?? "",
                  degreeStartDate: bg.degreeStartDate
                    ? format(bg.degreeStartDate, "yyyy-MM-dd")
                    : undefined,
                  degreeEndDate: bg.degreeEndDate
                    ? format(bg.degreeEndDate, "yyyy-MM-dd")
                    : undefined,
                }))
                : [],


            // workExperience → array of objects
            workExperience:
              Array.isArray(data.workExperience) && data.workExperience.length
                ? data.workExperience.map((we: {
                  jobTitle?: string;
                  organizationName?: string;
                  employmentType?: string;
                  from?: string | Date | null;
                  to?: string | Date | null;
                }) => ({
                  jobTitle: we.jobTitle || "",
                  organizationName: we.organizationName || "",
                  employmentType: we.employmentType || "",
                  from: we.from ? new Date(we.from) : null,
                  to: we.to ? new Date(we.to) : null,
                }))
                : [],

            // language proficiency fields
            proficiencyTest: data.proficiencyTest ?? "",
            proficiencyLevel: data.proficiencyLevel ?? "",
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
          };

          form.reset(formatted);
        }
      } catch (err) {
        console.error("Failed to load saved application", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, [form, token]);


  // 6️⃣ Show a loading state until data is ready
  if (isLoading) {
    return <div className="text-center py-10">Loading your application…</div>;
  }
  // Use watch to observe form values
  const watchedValues = form.watch();
  // Log watched values dynamically
  console.log("Watched Values:", watchedValues);

  return (
    <div className="flex flex-col w-[90%] xl:w-[60%] mx-auto mt-6">
      {/* ✅ Dynamic Heading */}
      <h6 className="font-semibold text-center">
        {currentPage === 1 && "Educational Background"}
        {currentPage === 2 && "Work Experience"}
        {currentPage === 3 && "Language Proficiency"}
        {currentPage === 4 && "Standardized Test"}
      </h6>
      <Form {...form}>
        <form onSubmit={handleFormSubmit}>
          {/* ✅ Multi-Step Form Content */}
          {currentPage === 1 && <EducationalBackground form={form} />}
          {currentPage === 2 && <WorkExperience form={form} />}
          {currentPage === 3 && <LanguageProficiency form={form} />}
          {currentPage === 4 && <StandardizedTest form={form} />}

          {/* ✅ Pagination Controls */}
          <Pagination>
            <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`p-2 text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {/* Current Page Number */}
              <span className="px-4 py-2 text-sm font-semibold rounded-lg border">
                {currentPage} of {totalPages}
              </span>

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handleNext}
                  className={`p-2 text-sm ${currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                    }`}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* ✅ Submit Button (Only on Last Page) */}
          {currentPage === totalPages && (
            <Button
              type="submit"
              size="lg"
              className="mt-4 p-2 bg-red-700  text-white rounded-md "
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ApplicationInfo;
