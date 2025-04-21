"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

type AnswerType = string | Date | null;

const questions: Question[] = [
  {
    id: 1,
    title: "What is your Country of Nationality?",
    type: "input",
    placeholder: "Enter your country",
  },
  { id: 2, title: "What is your Date of Birth?", type: "date" },
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
    type: "input",
    placeholder: "Describe your work experience (if any)",
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
    type: "smart-select", // changed from multiselect
    options: ["USA", "UK", "Germany", "Canada", "Australia", "Any Other (Specify)"],
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

const questionGroups: number[][] = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7, 8, 9], // English Proficiency Group
  [10],
  [11],
  [12],
  [13, 14], // Budget Group
];

const SuccessChances = () => {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});

  const progress = ((currentQuestion + 1) / questionGroups.length) * 100;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setCurrentQuestion(0);
      setShowWelcome(true);
    }
  }, [open]);

  const handleNext = () => {
    if (currentQuestion < questionGroups.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("Final Answers:", answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleAnswer = (value: AnswerType, id: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const currentGroup = questionGroups[currentQuestion];
  const groupQuestions = questions.filter((q) => currentGroup.includes(q.id));

  const smartDropdown = (options: string[], qId: number) => {
    const selected = (answers[qId] as string) || "";
    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selected || "Select an option"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
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
                    onSelect={() => handleAnswer(option, qId)}
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
              handleAnswer(`Any Other (Specify) - ${e.target.value}`, qId)
            }
          />
        )}
      </>
    );
  };

  const renderDialogContent = () => {
    if (showWelcome) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Let Zeus Get to know you!
          </h1>
          <p className="text-gray-600">
            Just a few questions to better understand your background and
            preferences.
          </p>
        </motion.div>
      );
    }

    return (
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
            {groupQuestions.map((q) => {
              const answer = answers[q.id] || "";
              return (
                <div key={q.id} className="space-y-4">
                  <div className="flex items-center gap-3 text-black">
                    <GraduationCap className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">{q.title}</h2>
                  </div>

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
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 p-3"
                      value={
                        answer
                          ? new Date(answer as string)
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
                        value={answer as string}
                        onChange={(e) => handleAnswer(e.target.value, q.id)}
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
                              `Any Other (Specify) - ${e.target.value}`,
                              q.id
                            )
                          }
                        />
                      )}
                    </>
                  )}

                  {q.type === "input" || q.type === "currency_input" ? (
                    <input
                      type="text"
                      placeholder={q.placeholder}
                      className="w-full rounded-lg border border-gray-300 p-3"
                      value={answer as string}
                      onChange={(e) => handleAnswer(e.target.value, q.id)}
                    />
                  ) : null}
                </div>
              );
            })}
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
          >
            {currentQuestion === questionGroups.length - 1 ? "Submit" : "Next"}
            {currentQuestion !== questionGroups.length - 1 && (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-red-700 hover:bg-red-700 text-white px-6 py-6 text-lg"
        >
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-0">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessChances;
