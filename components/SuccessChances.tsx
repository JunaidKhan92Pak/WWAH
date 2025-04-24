"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Combobox } from "./ui/combobox";
import { majorsAndDisciplines, studyDestinations } from "../lib/constant";
import { getNames } from "country-list";
import currency from "currency-codes";

const nationalities = getNames();
const currencyOptions = currency.data.map(
  (c: { code: string; currency: string }) => `${c.code} - ${c.currency}`
);

interface Question {
  id: number;
  title: string;
  type: string;
  placeholder?: string;
  options?: string[];
  followUp?: {
    title: string;
    type: string;
    condition: boolean;
  };
}

type AnswerType = string | Date | boolean | number | null;

interface Grade {
  gradeType: string;
  score: string;
}

interface StudentData {
  nationality: string;
  dateOfBirth: string;


  studyLevel: string;
  majorSubject: string;
  grade: Grade;

  hasExperience: boolean;
  years?: string;

  LanguageProficiency: {
    level: string;
    test?: string;
    score?: string;
  };
  StudyPreferenced: {
    country: string;
    degree: string;
    subject: string;
  };

  tuitionfee: {
    amount: string;
    currency: string;
  };
  livingCosts: {
    amount: string;
    currency: string;
  };

  submissionDate: string;
}

const questions: Question[] = [
  {
    id: 1,
    title: "What is your Country of Nationality?",
    type: "nationality",
    placeholder: "Select your nationality",
  },
  { id: 2, title: "What is your Date of Birth?", type: "date" },
  {
    id: 3,
    title: "What is your current level of study?",
    type: "select",
    options: [
      "Matric",
      "O Levels",
      "Intermediate",
      "A Levels",
      "Bachelor",
      "Master",
      "MPhil",
      "PhD",
      "Any Other (Specify)",
    ],
  },
  {
    id: 4,
    title: "What is your Major or field of study?",
    type: "major",
    placeholder: "Select your major or field",
  },
  {
    id: 5,
    title: "Obtained Grades/CGPA in your previous study?",
    type: "grades",
  },
  { id: 6, title: "Do you have any work experience?", type: "work_experience" },
  {
    id: 7,
    title: "What is your English Proficiency level?",
    type: "select",
    options: ["Native Speaker", "Willing to take a test", "Completed a test"],
  },
  {
    id: 8,
    title: "Which of the following English Proficiency tests have you taken?",
    type: "select",
    options: ["IELTS", "PTE", "TOEFL", "Any other (Specify)"],
  },
  {
    id: 9,
    title: "Obtained Scores",
    type: "input",
    placeholder: "Enter your English test score",
  },
  {
    id: 10,
    title: "Which country are you dreaming of studying in?",
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
    title: "What major or discipline are you interested in?",
    type: "major",
    placeholder: "Select your preferred major",
  },
  {
    id: 13,
    title: "What's your preferred annual tuition budget?",
    type: "currency",
    placeholder: "Enter tuition budget",
  },
  {
    id: 14,
    title: "And your estimated cost of living per year?",
    type: "currency",
    placeholder: "Enter cost of living",
  },
];

const questionGroups: number[][] = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7, 8, 9],
  [10],
  [11],
  [12],
  [13, 14],
];
const gradingScaleMap: Record<string, string> = {
  percentage: "Percentage Grade scale",
  cgpa: "Grade Point Average (GPA) Scale",
  letter: "Letter Grade Scale (A-F)",
  passfail: "Pass/Fail",
  other: "Any other (Specify)",
};

const letterToPercentage: Record<string, number> = {
  "A+": 95,
  A: 90,
  "A-": 85,
  "B+": 80,
  B: 75,
  "B-": 70,
  "C+": 65,
  C: 60,
  "C-": 55,
  "D+": 50,
  D: 45,
  "D-": 40,
  F: 30,
};

const isValidGradeInput = (type: string, score: string) => {
  if (type === "percentage") {
    const value = parseFloat(score);
    return !isNaN(value) && value >= 0 && value <= 100;
  }
  if (type === "cgpa") {
    const value = parseFloat(score);
    return !isNaN(value) && value >= 0 && value <= 4.0;
  }
  if (type === "letter") {
    return Object.keys(letterToPercentage).includes(score.toUpperCase());
  }
  if (type === "passfail") {
    return ["Pass", "Fail"].includes(score.trim());
  }
  return score.trim().length > 0;
};


const SuccessChances = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [selectedCurrency, setSelectedCurrency] = useState<
    Record<number, string>
  >({});
  const [gradeData, setGradeData] = useState<Grade>({
    gradeType: "",
    score: "",
  });

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const progress = ((currentQuestion + 1) / questionGroups.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any form submission when clicking Next
    e.preventDefault();

    if (currentQuestion < questionGroups.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any form submission when clicking Previous
    e.preventDefault();

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleAnswer = (value: AnswerType, id: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCurrency = (value: string, id: number) => {
    setSelectedCurrency((prev) => ({ ...prev, [id]: value }));
  };

  // Handle grade type change
  // const handleGradeTypeChange = (value: string) => {
  //   setGradesInput((prev) => ({ ...prev, gradeType: value }));
  // };

  // const handleGradeScoreChange = (value: string) => {
  //   handleAnswer((prev) => ({ ...prev, score: value })); // Stores the actual grade/CGPA
  // };
  const handleGradeTypeChange = (value: string) => {
    setGradeData((prev) => ({ ...prev, gradeType: value }));
  };

  const handleGradeScoreChange = (value: string) => {
    setGradeData((prev) => ({ ...prev, score: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submission triggered!", new Date().toISOString());
    e.preventDefault();

    const compiledStudentData: StudentData = {
      nationality: (answers[1] as string) || "",
      dateOfBirth: (answers[2] as string) || "",
      studyLevel: (answers[3] as string) || "",
      majorSubject: (answers[4] as string) || "",
      grade: gradeData,
      hasExperience: (answers[6] as boolean) || false,
      years: (answers[106] as string) || "",
      LanguageProficiency: {
        level: (answers[7] as string) || "",
        test: (answers[8] as string) || "",
        score: (answers[9] as string) || "",
      },
      StudyPreferenced: {
        country: (answers[10] as string) || "",
        degree: (answers[11] as string) || "",
        subject: (answers[12] as string) || "",
      },
      tuitionfee: {
        amount: (answers[13] as string) || "0",
        currency: selectedCurrency[13] || "",
      },
      livingCosts: {
        amount: (answers[14] as string) || "0",
        currency: selectedCurrency[14] || "",
      },
      submissionDate: new Date().toISOString(),
    };

    console.log("Student data compiled:", compiledStudentData);
    setStudentData(compiledStudentData);

    try {
      console.log("Attempting to submit data to backend...");
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API || "/api/"}success-chance/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(compiledStudentData),
        }
      );

      if (!resp.ok) {
        console.error("Error submitting data:", resp.statusText);
        return;
      }

      const data = await resp.json();
      console.log("Response from server:", data);

      // Reset form after successful submission
      setCurrentQuestion(0);
      setAnswers({});
      setSelectedCurrency({});
      setGradeData({ gradeType: "", score: "" });
      setShowWelcome(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const renderWorkExperience = (q: Question) => {
    const hasWorkExperience = answers[q.id] === true;
    return (
      <div className="space-y-4">
        <RadioGroup
          value={
            answers[q.id] === true ? "yes" : answers[q.id] === false ? "no" : ""
          }
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
              value={
                typeof answers[q.id + 100] === "number"
                  ? (answers[q.id + 100] as number)
                  : undefined
              }
              onChange={(e) => handleAnswer(Number(e.target.value), q.id + 100)}
              className="mt-2"
            />
          </motion.div>
        )}
      </div>
    );
  };

  const renderCurrencyInput = (q: Question) => {
    const currency = selectedCurrency[q.id] ?? currencyOptions[0];
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
          value={(answers[q.id] as string) || ""}
          onChange={(e) => handleAnswer(e.target.value, q.id)}
          className="mt-2"
        />
      </div>
    );
  };

  const renderInput = (q: Question) => (
    <Input
      type="text"
      placeholder={q.placeholder}
      className="w-full"
      value={(answers[q.id] as string) || ""}
      onChange={(e) => handleAnswer(e.target.value, q.id)}
    />
  );

  const renderGradesInput = () => {
    const isValid = isValidGradeInput(gradeData.gradeType, gradeData.score);

    return (
      <div className="space-y-4">
        <select
          className="w-full rounded-lg border border-gray-300 p-"
          value={gradeData.gradeType}
          onChange={(e) => handleGradeTypeChange(e.target.value)}
        >
          <option value="">Select an option</option>
          {Object.entries(gradingScaleMap).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {gradeData.gradeType && (
          <>
            <Input
              type="text"
              placeholder="Enter your grade/CGPA"
              className={`w-full mt-2 ${isValid ? "" : "border-red-500"}`}
              value={gradeData.score}
              onChange={(e) => handleGradeScoreChange(e.target.value)}
            />
            {!isValid && (
              <p className="text-sm text-red-600">
                Please enter a valid value for {gradeData.gradeType}.
              </p>
            )}
          </>
        )}
      </div>
    );
  };


  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="w-full max-w-[525px]">
      <Card className="p-6 shadow-lg bg-white border-0">
        <div className="mb-6 flex flex-col items-center">
          <Progress value={progress} className="h-3 w-[90%]" />
          <p className="text-xs text-gray-500 mt-2">
            {currentQuestion + 1} / {questionGroups.length}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {questions
              .filter((q) => questionGroups[currentQuestion].includes(q.id))
              .map((q) => (
                <div key={q.id} className="space-y-4">
                  <div className="flex items-center ga text-black">
                    <GraduationCap className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">{q.title}</h2>
                  </div>
                  {q.type === "nationality" && (
                    <Combobox
                      options={nationalities}
                      value={(answers[q.id] as string) || ""}
                      onChange={(val) => handleAnswer(val, q.id)}
                      placeholder="Select your nationality"
                      emptyMessage="No countries found"
                    />
                  )}
                  {q.type === "major" && (
                    <Combobox
                      options={majorsAndDisciplines}
                      value={(answers[q.id] as string) || ""}
                      onChange={(val) => handleAnswer(val, q.id)}
                      placeholder={q.placeholder}
                      emptyMessage="No majors found"
                    />
                  )}
                  {q.type === "study_destination" && (
                    <Combobox
                      options={studyDestinations}
                      value={(answers[q.id] as string) || ""}
                      onChange={(val) => handleAnswer(val, q.id)}
                      placeholder="Select country"
                      emptyMessage="No countries found"
                    />
                  )}
                  {q.type === "work_experience" && renderWorkExperience(q)}
                  {q.type === "currency" && renderCurrencyInput(q)}
                  {q.type === "input" && renderInput(q)}
                  {q.type === "date" && (
                    <Input
                      type="date"
                      className="w-full"
                      value={
                        answers[q.id]
                          ? new Date(answers[q.id] as string)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                      onChange={(e) => handleAnswer(e.target.value, q.id)}
                    />
                  )}
                  {q.type === "select" && (
                    <>
                      <select
                        className="w-full rounded-lg border border-gray-300 p-3"
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
                      {answers[q.id] === "Any Other (Specify)" && (
                        <Input
                          type="text"
                          className="mt-2"
                          placeholder="Please specify"
                          onChange={(e) =>
                            handleAnswer(
                              `Any Other (Specify) - ${e.target.value}`,
                              q.id
                            )
                          }
                        />
                      )}
                    </>
                  )}
                  {q.type === "grades" && renderGradesInput()}
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion === questionGroups.length - 1 ? (
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNext}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </form>
  );

  const renderSubmittedData = () => {
    if (!studentData) return null;

    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Form Submitted Successfully!
        </h3>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[525px] mx-auto">
      {showWelcome ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Let Zeus Get to know you!
          </h1>
          <p className="text-gray-600">
            Just a few questions to better understand your background and
            preferences.
          </p>
        </motion.div>
      ) : (
        renderFormContent()
      )}

      {studentData && renderSubmittedData()}
    </div>
  );
};

export default SuccessChances;
