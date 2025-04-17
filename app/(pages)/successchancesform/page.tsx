"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ArrowRight, GraduationCap, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const questions = [
  {
    id: 1,
    title: "What is your Country of Nationality?",
    type: "input",
    placeholder: "Enter your country",
  },
  {
    id: 2,
    title: "What is your Date of Birth?",
    type: "date",
  },
  {
    id: 3,
    title: "What is your current level of study?",
    type: "select",
    options: [
      "Matric/O Levels",
      "Intermediate/A Levels",
      "Bachelor",
      "Master/MPhil",
      "PhD",
      "Any Other (Specify)",
    ],
  },
  {
    id: 4,
    title: "What is your Major or field of study?",
    type: "input",
    placeholder: "Enter your major or field",
  },
  {
    id: 5,
    title: "Obtained Grades/CGPA in your previous study?",
    type: "input",
    placeholder: "Enter your grades or CGPA",
  },
  {
    id: 6,
    title: "Do you have any work experience?",
    type: "toggle",
    followUp: {
      title: "Tell me more about it",
      type: "textarea",
      condition: true,
    },
  },
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
    type: "multiselect",
    placeholder: "Select countries",
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
    type: "input",
    placeholder: "Enter your preferred major",
  },
  {
    id: 13,
    title: "What’s your preferred annual tuition budget?",
    type: "currency_input",
    placeholder: "Enter tuition budget",
  },
  {
    id: 14,
    title: "And your estimated cost of living per year?",
    type: "currency_input",
    placeholder: "Enter cost of living",
  },
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const smartDropdown = (options: string[], qId: number) => {
    const selected = answers[qId] || "";
    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selected ? selected : "Select an option"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandEmpty>No match found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleAnswer(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {selected === "Any Other (Specify)" && (
          <input
            type="text"
            placeholder="Please specify"
            className="w-full mt-2 rounded-lg border border-gray-300 p-3"
            onChange={(e) =>
              handleAnswer(`Any Other (Specify) - ${e.target.value}`)
            }
          />
        )}
      </>
    );
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FCE7D2] to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            “Let Zeus Get to know you!
          </h1>
          <p className="text-gray-600">
            Just a few questions to better understand your background and
            preferences.
          </p>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const answer = answers[q.id] || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FCE7D2] to-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 shadow-lg bg-white">
          <div className="mb-8 flex flex-col items-center">
            <Progress value={progress} className="h-3 w-[90%]" />
            <p className="text-xs text-gray-500 mt-2">
              {currentQuestion + 1} / {questions.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-black">
                <GraduationCap className="h-6 w-6" />
                <h2 className="text-xl font-semibold">{q.title}</h2>
              </div>

              <div className="space-y-4">
                {q.type === "smart-select" &&
                  smartDropdown(
                    q.title.includes("Country")
                      ? [
                        "Pakistan",
                        "India",
                        "USA",
                        "UK",
                        "Germany",
                        "Any Other (Specify)",
                      ]
                      : [
                        "Computer Science",
                        "Engineering",
                        "Business",
                        "Psychology",
                        "Any Other (Specify)",
                      ],
                    q.id
                  )}

                {q.type === "date" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {calendarDate
                          ? format(calendarDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={calendarDate}
                        onSelect={(date) => {
                          setCalendarDate(date);
                          handleAnswer(date?.toISOString() || "");
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {q.type === "select" && (
                  <>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
                      value={answer}
                      onChange={(e) => handleAnswer(e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {q.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {answer === "Any Other (Specify)" && (
                      <input
                        type="text"
                        placeholder="Please specify"
                        className="w-full mt-2 rounded-lg border border-gray-300 p-3"
                        onChange={(e) =>
                          handleAnswer(
                            `Any Other (Specify) - ${e.target.value}`
                          )
                        }
                      />
                    )}
                  </>
                )}

                {q.type === "input" && (
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
                    value={answer}
                    onChange={(e) => handleAnswer(e.target.value)}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
