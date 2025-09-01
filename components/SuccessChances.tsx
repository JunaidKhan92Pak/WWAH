"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Progress } from "./ui/progress"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { ArrowRight, GraduationCap, AlertCircle, Info } from "lucide-react"
import { Combobox } from "./ui/combobox"
import { studyDestinations } from "../lib/constant"
import synonyms from "@/synonyms.json"
import { getNames } from "country-list"
import currency from "currency-codes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAuthToken } from "@/utils/authHelper"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const nationalities = getNames()
const currencyOptions = currency.data.map((c: { code: string; currency: string }) => `${c.code} - ${c.currency}`)

const degreeOptions = [
  "Matric",
  "O levels",
  "Intermediate",
  // "A Levels",
  "Bachelor's (2 Years)",
  "Bachelor's (4 Years)",
  "Master's",
  "MPhil",
  "PhD",
]

const majorSubjectsByDegree: Record<string, { options: string[]; allowMultiple?: boolean; maxSelections?: number }> = {
  Matric: {
    options: ["biology", "computer science", "arts and humanities", "commerce"],
    allowMultiple: false,
  },
  "O levels": {
    options: ["medical science", "engineering", "computer science", "business", "arts and humanities"],
    allowMultiple: false,
  },
  Intermediate: {
    options: [
      "fsc pre medical",
      "fsc pre engineering",
      "isc physics",
      "isc Economisc",
      "isc Statistisc",
      "fs humanities",
      "icom",
    ],
    allowMultiple: false,
  },
  "A Levels": {
    options: [
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "Economics",
      "Psychology",
      "Sociology",
      "English Language",
      "History",
      "Global Perspectives & Research",
      "Media Studies",
      "Urdu",
      "Information Technology",
      "English Literature",
      "Business",
      "Politics",
      "Law",
      "Design and Technology",
      "Electronics",
      "Health and Social Care",
      "Accounting",
      "Art and Design",
      "Philosophy",
      "Religious Studies",
      "Classics",
      "History of Art",
      "French",
      "Spanish",
      "Classical Civilization",
      "Geography",
      "Fashion & Textiles",
      "Photography",
      "German",
      "Latin",
      "Environmental Management",
      "Marine Science",
      "Travel and Tourism",
      "Physical Education / Sports Science",
      "Music",
      "Drama / Theatre Studies",
      "Development Studies",
      "Foreign Language (Other)",
      "Any Other (Specify)",
    ],
    allowMultiple: true,
    maxSelections: 3,
  },
  "Bachelor's (2 Years)": {
    options: [
      "physics",
      "chemistry",
      "ciology",
      "Earth and Environmental Sciences",
      "astronomy",
      "biotechnology",
      "geology",
      "oceanography",
      "computer Science",
      "information Technology",
      "artificial intelligence",
      "cybersecurity",
      "data science",
      "software engineering",
      "game development",
      "engineering",
      "robotics and automation",
      "mathematics",
      "statistics",
      "actuarial science",
      "medicine",
      "dentistry",
      "nursing",
      "pharmacy",
      "physiotherapy",
      "public Health",
      "veterinary Science",
      "biochemistry",
      "molecular biology",
      "neuroscience",
      "genetics",
      "microbiology",
      "immunology",
      "radiology and medical imaging",
      "nutrition and dietetics",
      "occupational therapy",
      "speech and language therapy",
      "business administration",
      "marketing",
      "human resource management",
      "operations management",
      "supply chain management",
      "financial management",
      "investment and asset management",
      "banking and risk management",
      "accounting and auditing",
      "economics",
      "law",
      "international law",
      "political science",
      "public administration",
      "international relations",
      "psychology",
      "social work",
      "graphic design",
      "fashion gesign",
      "interior design",
      "architecture",
      "theatre and Drama",
      "film and television",
      "music performance and production",
      "dance",
      "journalism",
      "public relations",
      "digital media",
      "advertising",
      "education and pedagogy",
      "agricultural sciences",
      "food science and technology",
      "tourism and travel management",
      "event management",
      "culinary arts",
      "gender studies",
      "visual arts",
      "sports and exercise sciences",
      "media and communication",
      "marine science",
      "forestry",
      "horticulture and crop science",
      "aviation studies",
      "film studies",
      "fine arts",
      "project management",
      "finance",
      "commerce",
      "taxation",
      "animation",
      "teaching",
      "ecology",
      "hospitality management",
      "history",
      "literature",
      "creative writing",
      "clinical psychology",
      "botany",
      "anatomy",
      "zoology",
      "srchaeology",
      "sociology",
      "criminology",
      "modern languages and linguistics"
      // "Other (My exact major is not listed)",
    ],
    allowMultiple: false,
  },
  "Bachelor's (4 Years)": {
    options: [
      "physics",
      "chemistry",
      "ciology",
      "Earth and Environmental Sciences",
      "astronomy",
      "biotechnology",
      "geology",
      "oceanography",
      "computer Science",
      "information Technology",
      "artificial intelligence",
      "cybersecurity",
      "data science",
      "software engineering",
      "game development",
      "engineering",
      "robotics and automation",
      "mathematics",
      "statistics",
      "actuarial science",
      "medicine",
      "dentistry",
      "nursing",
      "pharmacy",
      "physiotherapy",
      "public Health",
      "veterinary Science",
      "biochemistry",
      "molecular biology",
      "neuroscience",
      "genetics",
      "microbiology",
      "immunology",
      "radiology and medical imaging",
      "nutrition and dietetics",
      "occupational therapy",
      "speech and language therapy",
      "business administration",
      "marketing",
      "human resource management",
      "operations management",
      "supply chain management",
      "financial management",
      "investment and asset management",
      "banking and risk management",
      "accounting and auditing",
      "economics",
      "law",
      "international law",
      "political science",
      "public administration",
      "international relations",
      "psychology",
      "social work",
      "graphic design",
      "fashion gesign",
      "interior design",
      "architecture",
      "theatre and Drama",
      "film and television",
      "music performance and production",
      "dance",
      "journalism",
      "public relations",
      "digital media",
      "advertising",
      "education and pedagogy",
      "agricultural sciences",
      "food science and technology",
      "tourism and travel management",
      "event management",
      "culinary arts",
      "gender studies",
      "visual arts",
      "sports and exercise sciences",
      "media and communication",
      "marine science",
      "forestry",
      "horticulture and crop science",
      "aviation studies",
      "film studies",
      "fine arts",
      "project management",
      "finance",
      "commerce",
      "taxation",
      "animation",
      "teaching",
      "ecology",
      "hospitality management",
      "history",
      "literature",
      "creative writing",
      "clinical psychology",
      "botany",
      "anatomy",
      "zoology",
      "srchaeology",
      "sociology",
      "criminology",
      "modern languages and linguistics"
      // "Other (My exact major is not listed)",
    ],
    allowMultiple: false,
  },
  "Master's": {
    options: [
      "physics",
      "chemistry",
      "ciology",
      "Earth and Environmental Sciences",
      "astronomy",
      "biotechnology",
      "geology",
      "oceanography",
      "computer Science",
      "information Technology",
      "artificial intelligence",
      "cybersecurity",
      "data science",
      "software engineering",
      "game development",
      "engineering",
      "robotics and automation",
      "mathematics",
      "statistics",
      "actuarial science",
      "medicine",
      "dentistry",
      "nursing",
      "pharmacy",
      "physiotherapy",
      "public Health",
      "veterinary Science",
      "biochemistry",
      "molecular biology",
      "neuroscience",
      "genetics",
      "microbiology",
      "immunology",
      "radiology and medical imaging",
      "nutrition and dietetics",
      "occupational therapy",
      "speech and language therapy",
      "business administration",
      "marketing",
      "human resource management",
      "operations management",
      "supply chain management",
      "financial management",
      "investment and asset management",
      "banking and risk management",
      "accounting and auditing",
      "economics",
      "law",
      "international law",
      "political science",
      "public administration",
      "international relations",
      "psychology",
      "social work",
      "graphic design",
      "fashion gesign",
      "interior design",
      "architecture",
      "theatre and Drama",
      "film and television",
      "music performance and production",
      "dance",
      "journalism",
      "public relations",
      "digital media",
      "advertising",
      "education and pedagogy",
      "agricultural sciences",
      "food science and technology",
      "tourism and travel management",
      "event management",
      "culinary arts",
      "gender studies",
      "visual arts",
      "sports and exercise sciences",
      "media and communication",
      "marine science",
      "forestry",
      "horticulture and crop science",
      "aviation studies",
      "film studies",
      "fine arts",
      "project management",
      "finance",
      "commerce",
      "taxation",
      "animation",
      "teaching",
      "ecology",
      "hospitality management",
      "history",
      "literature",
      "creative writing",
      "clinical psychology",
      "botany",
      "anatomy",
      "zoology",
      "srchaeology",
      "sociology",
      "criminology",
      "modern languages and linguistics"
      // "Other (My exact major is not listed)",
    ],
    allowMultiple: false,
  },
  MPhil: {
    options: [
      "physics",
      "chemistry",
      "ciology",
      "Earth and Environmental Sciences",
      "astronomy",
      "biotechnology",
      "geology",
      "oceanography",
      "computer Science",
      "information Technology",
      "artificial intelligence",
      "cybersecurity",
      "data science",
      "software engineering",
      "game development",
      "engineering",
      "robotics and automation",
      "mathematics",
      "statistics",
      "actuarial science",
      "medicine",
      "dentistry",
      "nursing",
      "pharmacy",
      "physiotherapy",
      "public Health",
      "veterinary Science",
      "biochemistry",
      "molecular biology",
      "neuroscience",
      "genetics",
      "microbiology",
      "immunology",
      "radiology and medical imaging",
      "nutrition and dietetics",
      "occupational therapy",
      "speech and language therapy",
      "business administration",
      "marketing",
      "human resource management",
      "operations management",
      "supply chain management",
      "financial management",
      "investment and asset management",
      "banking and risk management",
      "accounting and auditing",
      "economics",
      "law",
      "international law",
      "political science",
      "public administration",
      "international relations",
      "psychology",
      "social work",
      "graphic design",
      "fashion gesign",
      "interior design",
      "architecture",
      "theatre and Drama",
      "film and television",
      "music performance and production",
      "dance",
      "journalism",
      "public relations",
      "digital media",
      "advertising",
      "education and pedagogy",
      "agricultural sciences",
      "food science and technology",
      "tourism and travel management",
      "event management",
      "culinary arts",
      "gender studies",
      "visual arts",
      "sports and exercise sciences",
      "media and communication",
      "marine science",
      "forestry",
      "horticulture and crop science",
      "aviation studies",
      "film studies",
      "fine arts",
      "project management",
      "finance",
      "commerce",
      "taxation",
      "animation",
      "teaching",
      "ecology",
      "hospitality management",
      "history",
      "literature",
      "creative writing",
      "clinical psychology",
      "botany",
      "anatomy",
      "zoology",
      "srchaeology",
      "sociology",
      "criminology",
      "modern languages and linguistics"
      // "Other (My exact major is not listed)",
    ],
    allowMultiple: false,
  },
  PhD: {
    options: [
      "physics",
      "chemistry",
      "ciology",
      "Earth and Environmental Sciences",
      "astronomy",
      "biotechnology",
      "geology",
      "oceanography",
      "computer Science",
      "information Technology",
      "artificial intelligence",
      "cybersecurity",
      "data science",
      "software engineering",
      "game development",
      "engineering",
      "robotics and automation",
      "mathematics",
      "statistics",
      "actuarial science",
      "medicine",
      "dentistry",
      "nursing",
      "pharmacy",
      "physiotherapy",
      "public Health",
      "veterinary Science",
      "biochemistry",
      "molecular biology",
      "neuroscience",
      "genetics",
      "microbiology",
      "immunology",
      "radiology and medical imaging",
      "nutrition and dietetics",
      "occupational therapy",
      "speech and language therapy",
      "business administration",
      "marketing",
      "human resource management",
      "operations management",
      "supply chain management",
      "financial management",
      "investment and asset management",
      "banking and risk management",
      "accounting and auditing",
      "economics",
      "law",
      "international law",
      "political science",
      "public administration",
      "international relations",
      "psychology",
      "social work",
      "graphic design",
      "fashion gesign",
      "interior design",
      "architecture",
      "theatre and Drama",
      "film and television",
      "music performance and production",
      "dance",
      "journalism",
      "public relations",
      "digital media",
      "advertising",
      "education and pedagogy",
      "agricultural sciences",
      "food science and technology",
      "tourism and travel management",
      "event management",
      "culinary arts",
      "gender studies",
      "visual arts",
      "sports and exercise sciences",
      "media and communication",
      "marine science",
      "forestry",
      "horticulture and crop science",
      "aviation studies",
      "film studies",
      "fine arts",
      "project management",
      "finance",
      "commerce",
      "taxation",
      "animation",
      "teaching",
      "ecology",
      "hospitality management",
      "history",
      "literature",
      "creative writing",
      "clinical psychology",
      "botany",
      "anatomy",
      "zoology",
      "srchaeology",
      "sociology",
      "criminology",
      "modern languages and linguistics"
      // "Other (My exact major is not listed)",
    ],
    allowMultiple: false,
  },
}

const englishProficiencyOptions = [
  "Native Speaker",
  "Willing to take a test",
  "Completed a test or have proof of English proficiency",
  "I want WWAH to help me with this",
]

const englishTestOptions = [
  "IELTS",
  "PTE Academic",
  "TOEFL iBT",
  "TOEFL PBT",
  "Duolingo English Test",
  "LanguageCert Academic",
  "Cambridge English Advanced (CAE)",
  "Oxford ELLT",
  "MOI (Medium of Instruction)",
  "Any Other (Specify)",
]

const testScoreRanges: Record<string, { min: number; max: number; label: string }> = {
  "IELTS": { min: 0, max: 9, label: "Enter your IELTS overall score (e.g., 6.5)" },
  "TOEFL": { min: 0, max: 120, label: "Enter your TOEFL iBT score (e.g., 95)" },
  "TOEFL PBT": { min: 310, max: 677, label: "Enter your TOEFL PBT score (e.g., 550)" },
  "PTE": { min: 10, max: 90, label: "Enter your PTE Academic score (e.g., 65)" },
  "Duolingo English Test": { min: 10, max: 160, label: "Enter your Duolingo score (e.g., 105)" },
  "LanguageCert Academic": { min: 45, max: 100, label: "Enter your LanguageCert Academic score (e.g., 78)" },
  "Cambridge English Advanced (CAE)": { min: 160, max: 210, label: "Enter your CAE score (e.g., 185)" },
  "Oxford ELLT": { min: 1, max: 12, label: "Enter your Oxford ELLT score (e.g., 10)" },
}

const nonEnglishCountries = ["Germany", "Italy", "France", "Spain", "Netherlands", "Sweden", "Norway", "Denmark"]

const gradingScaleOptions = [
  "Percentage Grade Scale",
  "CGPA Grade Scale",
  "Letter Grade Scale",
  "Pass/Fail Scale",
  "Any Other (Specify)",
]

interface Question {
  id: number
  title: string
  type: string
  placeholder?: string
  options?: string[]
  followUp?: {
    title: string
    type: string
    condition: boolean
  }
}

type AnswerType = string | Date | boolean | number | null | string[]

interface Grade {
  gradeType: string
  score: string
  cgpaOutOf?: string
}

interface ValidationError {
  field: string
  message: string
}

interface StudentData {
  nationality: string
  dateOfBirth: string
  studyLevel: string
  majorSubject: string | string[]
  grade: Grade
  hasExperience: boolean
  years?: number
  LanguageProficiency: {
    level: string
    test?: string
    score?: number
  }
  StudyPreferenced: {
    country: string
    degree: string
    subject: string
  }
  tuitionfee: {
    amount: number
    currency: string
  }
  livingCosts: {
    amount: number
    currency: string
  }
  submissionDate: string
}

const questions: Question[] = [
  {
    id: 1,
    title: "What is your Nationality?",
    type: "nationality",
    placeholder: "Select your nationality",
  },
  { id: 2, title: "What is your date of birth?", type: "date" },
  {
    id: 3,
    title: "What is the highest degree or qualification you have obtained?",
    type: "select",
    options: degreeOptions,
  },
  {
    id: 4,
    title: "What was your major subject or field of study?",
    type: "major",
    placeholder: "Select your major or field",
  },
  {
    id: 5,
    title: "What grades did you get in your previous studies?",
    type: "grades",
  },
  { id: 6, title: "Do you have any Work Experience?", type: "work_experience" },
  {
    id: 7,
    title: "What is your English Proficiency Level?",
    type: "select",
    options: englishProficiencyOptions,
  },
  {
    id: 8,
    title: "Which English test or proof do you have?",
    type: "select",
    options: englishTestOptions,
  },
  {
    id: 9,
    title: "Overall Scores",
    type: "english_score",
    placeholder: "Enter your test score",
  },
  {
    id: 10,
    title: "What is your preferred study destination?",
    type: "study_destination",
  },
  {
    id: 11,
    title: "What level of study are you planning next?",
    type: "select",
    options: ["Bachelor", "Master", "PhD", "Diploma", "Certificate"],
  },
  {
    id: 12,
    title: "Which subject or field do you want to apply for?",
    type: "major",
    placeholder: "Select your preferred major",
  },
  {
    id: 13,
    title: "What is your preferred annual tuition budget?",
    type: "currency",
    placeholder: "Enter tuition budget",
  },
  {
    id: 14,
    title: "What is your estimated cost of living per year?",
    type: "currency",
    placeholder: "Enter cost of living",
  },
]

const questionGroups: number[][] = [[1], [2], [3], [4], [5], [6], [7, 8, 9], [10], [11], [12], [13, 14]]

// const gradingScaleMap: Record<string, string> = {
//   percentage: "Percentage Grade scale",
//   cgpa: "Grade Point Average (GPA) Scale",
//   letter: "Letter Grade Scale (A-F)",
//   passfail: "Pass/Fail",
//   other: "Any other (Specify)",
// }

// const letterToPercentage: Record<string, number> = {
//   "A+": 95,
//   A: 90,
//   "A-": 85,
//   "B+": 80,
//   B: 75,
//   "B-": 70,
//   "C+": 65,
//   C: 60,
//   "C-": 55,
//   "D+": 50,
//   D: 45,
//   "D-": 40,
//   F: 30,
// }

// const isValidGradeInput = (type: string, score: string) => {
//   if (type === "percentage") {
//     const value = Number.parseFloat(score)
//     return !isNaN(value) && value >= 0 && value <= 100
//   }
//   if (type === "cgpa") {
//     const value = Number.parseFloat(score)
//     return !isNaN(value) && value >= 0 && value <= 4.0
//   }
//   if (type === "letter") {
//     return Object.keys(letterToPercentage).includes(score.toUpperCase())
//   }
//   if (type === "passfail") {
//     return ["Pass", "Fail"].includes(score.trim())
//   }
//   return score.trim().length > 0
// }

const SuccessChances = () => {
  const [successOpen, setSuccessOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({})
  const [selectedCurrency, setSelectedCurrency] = useState<Record<number, string>>({})
  const [gradeData, setGradeData] = useState<Grade>({ gradeType: "", score: "" })
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customSubjects, setCustomSubjects] = useState<string[]>([])
  const [showCustomSubjectModal, setShowCustomSubjectModal] = useState(false)
  const [showLanguageHelp, setShowLanguageHelp] = useState(false)
  const progress = ((currentQuestion + 1) / questionGroups.length) * 100

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  console.warn(showCustomSubjectModal, showLanguageHelp)
  useEffect(() => {
    if (answers[7] !== "Completed a test or have proof of English proficiency") {
      setAnswers((prev) => ({
        ...prev,
        8: null,
        9: null,
      }))
    }
  }, [answers[7]])

  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(() => {
        setSuccessOpen(false)
        console.log("Form submitted successfully - would navigate back")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [successOpen])

  const validateDateOfBirth = (dateString: string): boolean => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/
    return dobRegex.test(dateString)
  }

  const validateFormData = (): ValidationError[] => {
    const errors: ValidationError[] = []

    const requiredFields = [
      { field: answers[3], name: "Study Level", key: "studyLevel" },
      { field: gradeData, name: "Grade", key: "grade" },
      { field: answers[2], name: "Date of Birth", key: "dateOfBirth" },
      { field: answers[1], name: "Nationality", key: "nationality" },
      { field: gradeData.gradeType, name: "Grade Type", key: "gradeType" },
      { field: answers[4], name: "Major Subject", key: "majorSubject" },
    ]

    for (const { field, name, key } of requiredFields) {
      if (!field || (typeof field === "string" && field.trim() === "")) {
        errors.push({
          field: key,
          message: `${name} is required`,
        })
      }
    }

    if (!gradeData.gradeType || !gradeData.score) {
      errors.push({
        field: "grade",
        message: "Grade type and score are required",
      })
    } else if (!isValidGradeInput(gradeData.gradeType, gradeData.score)) {
      errors.push({
        field: "grade.score",
        message: "Please enter a valid grade score for the selected grade type",
      })
    }

    if (gradeData.gradeType === "CGPA Grade Scale" && !gradeData.cgpaOutOf) {
      errors.push({
        field: "grade.cgpaOutOf",
        message: "CGPA scale (out of) is required",
      })
    }

    const livingCostsAmount = answers[14] as number
    const livingCostsCurrency = selectedCurrency[14]
    if (!livingCostsAmount || !livingCostsCurrency) {
      errors.push({
        field: "livingCosts",
        message: "Living costs amount and currency are required",
      })
    }

    const tuitionAmount = answers[13] as number
    const tuitionCurrency = selectedCurrency[13]
    if (!tuitionAmount || !tuitionCurrency) {
      errors.push({
        field: "tuitionFee",
        message: "Tuition fee amount and currency are required",
      })
    }

    const studyCountry = answers[10] as string
    const studyDegree = answers[11] as string
    const studySubject = answers[12] as string

    if (!studyCountry || !studyDegree || !studySubject) {
      errors.push({
        field: "StudyPreferenced",
        message: "Study preferences (country, degree, and subject) are required",
      })
    }

    const dateOfBirth = answers[2] as string
    if (dateOfBirth && !validateDateOfBirth(dateOfBirth)) {
      errors.push({
        field: "dateOfBirth",
        message: "Date of birth must be in YYYY-MM-DD format",
      })
    }

    return errors
  }

  const isValidGradeInput = (type: string, score: string, cgpaOutOf?: string) => {
    if (type === "Percentage Grade Scale") {
      const value = Number.parseFloat(score)
      return !isNaN(value) && value >= 0 && value <= 100
    }
    if (type === "CGPA Grade Scale") {
      const value = Number.parseFloat(score)
      const outOfValue = Number.parseFloat(cgpaOutOf || "4")
      return !isNaN(value) && !isNaN(outOfValue) && value >= 0 && value <= outOfValue
    }
    if (type === "Letter Grade Scale") {
      const validGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]
      return validGrades.includes(score.toUpperCase())
    }
    if (type === "Pass/Fail Scale") {
      return ["Pass", "Fail"].includes(score.trim())
    }
    return score.trim().length > 0
  }

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentQuestion < questionGroups.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setValidationErrors([])
    }
  }

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setValidationErrors([])
    }
  }

  const handleAnswer = (value: AnswerType, id: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setValidationErrors((prev) =>
      prev.filter((error) => !error.field.includes(id.toString()) && error.field !== getFieldNameById(id)),
    )
  }

  const handleCurrency = (value: string, id: number) => {
    setSelectedCurrency((prev) => ({ ...prev, [id]: value }))
  }

  const handleGradeTypeChange = (value: string) => {
    setGradeData((prev) => ({ ...prev, gradeType: value, score: "", cgpaOutOf: "" }))
    setValidationErrors((prev) => prev.filter((error) => !error.field.includes("grade")))
  }

  const handleGradeScoreChange = (value: string) => {
    setGradeData((prev) => ({ ...prev, score: value }))
    setValidationErrors((prev) => prev.filter((error) => !error.field.includes("grade")))
  }

  const handleCgpaOutOfChange = (value: string) => {
    setGradeData((prev) => ({ ...prev, cgpaOutOf: value }))
    setValidationErrors((prev) => prev.filter((error) => !error.field.includes("grade")))
  }

  const getFieldNameById = (id: number): string => {
    const fieldMap: Record<number, string> = {
      1: "nationality",
      2: "dateOfBirth",
      3: "studyLevel",
      4: "majorSubject",
      5: "grade",
      10: "StudyPreferenced",
      11: "StudyPreferenced",
      12: "StudyPreferenced",
      13: "tuitionFee",
      14: "livingCosts",
    }
    return fieldMap[id] || ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const errors = validateFormData()
    if (errors.length > 0) {
      setValidationErrors(errors)
      setIsSubmitting(false)
      return
    }
    setValidationErrors([])

    const compiledStudentData: StudentData = {
      nationality: answers[1] as string,
      dateOfBirth: answers[2] as string,
      studyLevel: answers[3] as string,
      majorSubject: answers[4] as string | string[],
      grade: gradeData,
      hasExperience: answers[6] as boolean,
      years: answers[106] as number,
      LanguageProficiency: {
        level: answers[7] as string,
        test: answers[8] as string,
        score: answers[9] as number,
      },
      StudyPreferenced: {
        country: answers[10] as string,
        degree: answers[11] as string,
        subject: answers[12] as string,
      },
      tuitionfee: {
        amount: Number(answers[13]),
        currency: selectedCurrency[13],
      },
      livingCosts: {
        amount: Number(answers[14]),
        currency: selectedCurrency[14],
      },
      submissionDate: new Date().toISOString(),
    }
    setStudentData(compiledStudentData)

    try {
      console.log("Attempting to submit data to backend...")
      const token = getAuthToken()
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}success-chance/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(compiledStudentData),
      })
      console.log("Response:", resp)

      if (!resp.ok) {
        const errorText = await resp.text()
        console.error("Error submitting data:", resp.status, errorText)
        setValidationErrors([
          {
            field: "general",
            message: `Submission failed: ${resp.status} ${resp.statusText}`,
          },
        ])
        return
      }

      setSuccessOpen(true)
      setCurrentQuestion(0)
      setAnswers({})
      setSelectedCurrency({})
      setGradeData({ gradeType: "", score: "" })
      setShowWelcome(true)
    } catch (error) {
      console.error("Error submitting data:", error)
      setValidationErrors([
        {
          field: "general",
          message: "Network error. Please try again.",
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderWorkExperience = (q: Question) => {
    const hasWorkExperience = answers[q.id] === true
    return (
      <div className="space-y-4">
        <RadioGroup
          value={answers[q.id] === true ? "yes" : answers[q.id] === false ? "no" : ""}
          onValueChange={(value) => handleAnswer(value === "yes", q.id)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
        {hasWorkExperience && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2"
          >
            <Label htmlFor="years-experience">Years of Experience</Label>
            <Input
              id="years-experience"
              type="number"
              min="0"
              placeholder="Enter number of years"
              value={typeof answers[q.id + 100] === "number" ? (answers[q.id + 100] as number) : undefined}
              onChange={(e) => handleAnswer(Number(e.target.value), q.id + 100)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
          </motion.div>
        )}
      </div>
    )
  }

  const renderCurrencyInput = (q: Question) => {
    const currency = selectedCurrency[q.id] ?? currencyOptions[0]
    const hasError = validationErrors.some((error) => error.field === (q.id === 13 ? "tuitionFee" : "livingCosts"))

    return (
      <div className="space-y-4">
        <Combobox
          options={currencyOptions}
          value={currency}
          onChange={(value) => handleCurrency(value, q.id)}
          placeholder="Select currency"
        />
        <Input
          type="number"
          min="0"
          placeholder={q.placeholder}
          value={(answers[q.id] as number) || ""}
          onChange={(e) => handleAnswer(Number(e.target.value), q.id)}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
            }`}
        />
      </div>
    )
  }

  const renderGradesInput = () => {
    const hasError = validationErrors.some((error) => error.field.includes("grade"))

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="grade-scale">What grading system was used in your last qualification?</Label>
          <select
            id="grade-scale"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm text-base font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
              }`}
            value={gradeData.gradeType}
            onChange={(e) => handleGradeTypeChange(e.target.value)}
          >
            <option value="">Select grading system</option>
            {gradingScaleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {gradeData.gradeType && (
          <div className="space-y-4">
            {gradeData.gradeType === "Percentage Grade Scale" && (
              <div>
                <Label htmlFor="percentage-grade">Enter your percentage (e.g., 85% or 65.4%)</Label>
                <Input
                  id="percentage-grade"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter percentage (0-100)"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                    }`}
                  value={gradeData.score}
                  onChange={(e) => handleGradeScoreChange(e.target.value)}
                />
              </div>
            )}

            {gradeData.gradeType === "CGPA Grade Scale" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cgpa-obtained">CGPA obtained (e.g., 3.5)</Label>
                  <Input
                    id="cgpa-obtained"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter CGPA"
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                      }`}
                    value={gradeData.score}
                    onChange={(e) => handleGradeScoreChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cgpa-out-of">Out of (e.g., 4.0, 5.0, 10.0)</Label>
                  <Input
                    id="cgpa-out-of"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="Scale (e.g., 4.0)"
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                      }`}
                    value={gradeData.cgpaOutOf || ""}
                    onChange={(e) => handleCgpaOutOfChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            {gradeData.gradeType === "Letter Grade Scale" && (
              <div>
                <Label htmlFor="letter-grade">Enter your Letter Grade (e.g., A+)</Label>
                <Input
                  id="letter-grade"
                  type="text"
                  placeholder="Enter letter grade (A+, A, B+, etc.)"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                    }`}
                  value={gradeData.score}
                  onChange={(e) => handleGradeScoreChange(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {gradeData.gradeType === "Pass/Fail Scale" && (
              <div>
                <Label htmlFor="pass-fail">Select your result</Label>
                <select
                  id="pass-fail"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm text-base font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                    }`}
                  value={gradeData.score}
                  onChange={(e) => handleGradeScoreChange(e.target.value)}
                >
                  <option value="">Select result</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            )}

            {gradeData.gradeType === "Any Other (Specify)" && (
              <div>
                <Label htmlFor="other-grade">Please describe your grading system or enter your grade</Label>
                <Input
                  id="other-grade"
                  type="text"
                  placeholder="Describe your grade or grading system"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-300"
                    }`}
                  value={gradeData.score}
                  onChange={(e) => handleGradeScoreChange(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderEnglishScoreInput = (q: Question) => {
    const selectedTest = answers[8] as string

    if (!selectedTest || selectedTest === "MOI (Medium of Instruction)") {
      return null
    }

    if (selectedTest === "Any Other (Specify)") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="custom-test">Test Name</Label>
            <Input
              id="custom-test"
              type="text"
              placeholder="Enter test name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="custom-score">Overall Score</Label>
            <Input
              id="custom-score"
              type="text"
              placeholder="Enter your score"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              value={(answers[q.id] as string) || ""}
              onChange={(e) => handleAnswer(e.target.value, q.id)}
            />
          </div>
        </div>
      )
    }

    const testRange = testScoreRanges[selectedTest]
    if (!testRange) return null

    return (
      <div>
        <Label htmlFor="test-score">{testRange.label}</Label>
        <Input
          id="test-score"
          type="number"
          min={testRange.min}
          max={testRange.max}
          step={selectedTest.includes("IELTS") ? "0.5" : "1"}
          placeholder={`Score (${testRange.min}-${testRange.max})`}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          value={(answers[q.id] as number) || ""}
          onChange={(e) => handleAnswer(Number(e.target.value), q.id)}
        />
      </div>
    )
  }

  const renderMajorSubject = (q: Question) => {
    const selectedDegree = q.id === 4 ? (answers[3] as string) : (answers[11] as string)
    const degreeConfig = majorSubjectsByDegree[selectedDegree]

    if (!degreeConfig) {
      return (
        <Combobox
          options={Object.keys(synonyms)}
          value={(answers[q.id] as string) || ""}
          onChange={(val) => handleAnswer(val, q.id)}
          placeholder={q.placeholder}
          emptyMessage="No majors found"
        />


      )
    }

    if (degreeConfig.allowMultiple) {
      const selectedSubjects = (answers[q.id] as string[]) || []
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select up to {degreeConfig.maxSelections} subjects:</p>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {degreeConfig.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`subject-${option}`}
                  checked={selectedSubjects.includes(option)}
                  onChange={(e) => {
                    let newSelection = [...selectedSubjects]
                    if (e.target.checked) {
                      if (newSelection.length < (degreeConfig.maxSelections || 3)) {
                        newSelection.push(option)
                      }
                    } else {
                      newSelection = newSelection.filter((s) => s !== option)
                    }
                    handleAnswer(newSelection, q.id)
                  }}
                  disabled={
                    !selectedSubjects.includes(option) && selectedSubjects.length >= (degreeConfig.maxSelections || 3)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor={`subject-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>

          {selectedSubjects.includes("Foreign Language (Other)") && (
            <div>
              <Label htmlFor="custom-language">Specify the language:</Label>
              <Input
                id="custom-language"
                type="text"
                placeholder="Enter the language name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              />
            </div>
          )}

          {selectedSubjects.includes("Any Other (Specify)") && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Write 3 custom subjects:</p>
              {[1, 2, 3].map((num) => (
                <Input
                  key={num}
                  type="text"
                  placeholder={`Custom subject ${num}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  value={customSubjects[num - 1] || ""}
                  onChange={(e) => {
                    const newCustom = [...customSubjects]
                    newCustom[num - 1] = e.target.value
                    setCustomSubjects(newCustom)
                  }}
                />
              ))}
              {customSubjects.filter((s) => s.trim()).length === 3 && (
                <div>
                  <Label>Which of the following stream best describes your field?</Label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500">
                    <option value="">Select stream</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div>
        <Combobox
          options={degreeConfig.options}
          value={(answers[q.id] as string) || ""}
          onChange={(val) => {
            handleAnswer(val, q.id)
            if (val === "Other (My exact major is not listed)") {
              setShowCustomSubjectModal(true)
            }
          }}
          placeholder={q.placeholder}
          emptyMessage="No majors found"
        />

        {(answers[q.id] as string) === "Other (My exact major is not listed)" && (
          <div className="mt-4 space-y-4">
            <Input
              type="text"
              placeholder="Enter your exact major"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Please select the subject from the list that best describes your field of study. This helps us match you
                to the right courses.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    )
  }

  const renderStudyDestination = (q: Question) => {
    const selectedCountry = answers[q.id] as string
    const isNonEnglishCountry = nonEnglishCountries.includes(selectedCountry)

    return (
      <div className="space-y-4">
        <Combobox
          options={studyDestinations}
          value={selectedCountry || ""}
          onChange={(val) => handleAnswer(val, q.id)}
          placeholder="Select country"
          emptyMessage="No countries found"
        />

        {isNonEnglishCountry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-medium text-gray-900">
              Have you studied or are currently learning{" "}
              {selectedCountry === "Germany"
                ? "German"
                : selectedCountry === "Italy"
                  ? "Italian"
                  : "the local language"}
              ?
            </h4>
            <RadioGroup className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="lang-yes" />
                <Label htmlFor="lang-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="lang-no" />
                <Label htmlFor="lang-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="help" id="lang-help" />
                <Label htmlFor="lang-help">I want to learn it with the help of WWAH</Label>
              </div>
            </RadioGroup>

            <div className="mt-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Based on your selected country, additional language proficiency may be required or advantageous.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="mt-2 bg-transparent" onClick={() => setShowLanguageHelp(true)}>
                Register for Language Classes
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const shouldRenderQuestion = (questionId: number) => {
    if (questionId !== 8 && questionId !== 9) {
      return true
    }
    return answers[7] === "Completed a test or have proof of English proficiency"
  }

  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null

    return (
      <div className="mb-6">
        {validationErrors.map((error, index) => (
          <Alert key={index} className="mb-2 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    )
  }

  const renderEnglishProficiency = (q: Question) => {
    const selectedLevel = answers[q.id] as string

    return (
      <div className="space-y-4">
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          value={selectedLevel || ""}
          onChange={(e) => handleAnswer(e.target.value, q.id)}
        >
          <option value="">Select proficiency level</option>
          {q.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selectedLevel === "I want WWAH to help me with this" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-blue-800 font-medium mb-2">We&apos;ll help you prepare for IELTS, PTE & more.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Register for English Prep Classes</Button>
          </motion.div>
        )}
      </div>
    )
  }

  const renderFormContent = () => (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full">
          <Card className="p-8 shadow-2xl bg-white rounded-2xl border border-gray-200 max-w-3xl w-full">
            <div className="mb-6 flex flex-col items-center">
              <Progress value={progress} className="h-3 w-[90%]" />
              <p className="text-xs text-gray-500 mt-2">
                {currentQuestion + 1} / {questionGroups.length}
              </p>
            </div>

            {renderValidationErrors()}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {questions
                  .filter((q) => questionGroups[currentQuestion].includes(q.id) && shouldRenderQuestion(q.id))
                  .map((q) => {
                    const fieldName = getFieldNameById(q.id)
                    const hasFieldError = validationErrors.some(
                      (error) => error.field === fieldName || error.field.includes(q.id.toString()),
                    )

                    return (
                      <div key={q.id} className="space-y-4">
                        <div className="flex items-center gap-2 text-black">
                          <GraduationCap className="h-6 w-6" />
                          <h2 className="text-xl font-semibold">{q.title}</h2>
                          {hasFieldError && <AlertCircle className="h-5 w-5 text-red-500" />}
                          {q.id === 8 && (answers[8] as string) === "MOI (Medium of Instruction)" && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  MOI is a letter from your university confirming that your degree was taught in
                                  English. Some universities accept it instead of IELTS/PTE.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                        {q.type === "nationality" && (
                          <div className={hasFieldError ? "ring-2 ring-red-200 rounded-lg" : ""}>
                            <Combobox
                              options={nationalities}
                              value={(answers[q.id] as string) || ""}
                              onChange={(val) => handleAnswer(val, q.id)}
                              placeholder="Select your nationality"
                              emptyMessage="No countries found"
                            />
                          </div>
                        )}

                        {q.type === "major" && (
                          <div className={hasFieldError ? "ring-2 ring-red-200 rounded-lg" : ""}>
                            {renderMajorSubject(q)}
                          </div>
                        )}

                        {q.type === "study_destination" && (
                          <div className={hasFieldError ? "ring-2 ring-red-200 rounded-lg" : ""}>
                            {renderStudyDestination(q)}
                          </div>
                        )}

                        {q.type === "work_experience" && renderWorkExperience(q)}
                        {q.type === "currency" && renderCurrencyInput(q)}
                        {q.type === "english_score" && renderEnglishScoreInput(q)}

                        {q.type === "date" && (
                          <div className="relative w-full">
                            <input
                              type="date"
                              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 appearance-none ${hasFieldError ? "border-red-500" : "border-gray-300"
                                }`}
                              value={answers[q.id] ? new Date(answers[q.id] as string).toISOString().split("T")[0] : ""}
                              onChange={(e) => handleAnswer(e.target.value, q.id)}
                            />
                          </div>
                        )}

                        {q.type === "select" && q.id === 7 && renderEnglishProficiency(q)}

                        {q.type === "select" && q.id !== 7 && (
                          <>
                            <select
                              className={`w-full px-4 py-2 border rounded-lg shadow-sm text-base font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${hasFieldError ? "border-red-500" : "border-gray-300"
                                }`}
                              value={(answers[q.id] as string) || ""}
                              onChange={(e) => handleAnswer(e.target.value, q.id)}
                            >
                              <option value="">Select an option</option>
                              {q.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {(answers[q.id] as string)?.startsWith("Any Other (Specify)") && (
                              <Input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                                placeholder="Please specify"
                                onChange={(e) => handleAnswer(`Any Other (Specify) - ${e.target.value}`, q.id)}
                              />
                            )}
                          </>
                        )}

                        {q.type === "grades" && renderGradesInput()}
                      </div>
                    )
                  })}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>
              {currentQuestion === questionGroups.length - 1 ? (
                <Button type="submit" className="bg-red-700 hover:bg-red-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button type="button" className="bg-red-700 hover:bg-red-700 text-white" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </form>
      </div>
    </TooltipProvider>
  )

  // const renderSubmittedData = () => {
  //   return (
  //     <div>
  //       <Dialog
  //         open={successOpen}
  //         onOpenChange={(isOpen) => {
  //           if (!isOpen) {
  //             setSuccessOpen(false)
  //           }
  //         }}
  //       >
  //         <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
  //           <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
  //             <div className="text-green-600 text-4xl">✓</div>
  //           </div>
  //           <DialogHeader>
  //             <DialogTitle className="text-lg font-semibold text-gray-900">Form Submitted Successfully!</DialogTitle>
  //           </DialogHeader>
  //         </DialogContent>
  //       </Dialog>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {showWelcome ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-10 bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Let Zeus Get to know you!</h1>
            <p className="text-gray-600">Just a few questions to better understand your background and preferences.</p>
          </motion.div>
        ) : (
          renderFormContent()
        )}

        {studentData && (
          <Dialog
            open={successOpen}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSuccessOpen(false)
              }
            }}
          >
            <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="text-green-600 text-4xl">✓</div>
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">Form Submitted Successfully!</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default SuccessChances
