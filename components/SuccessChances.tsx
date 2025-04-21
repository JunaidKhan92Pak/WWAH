

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { majorsAndDisciplines, studyDestinations } from "@/lib/constants";
import { getNames } from "country-list";
import currencyListRaw from "currency-codes/data";

const nationalities = getNames();
const currencyOptions = currencyListRaw.map(
  (currency: { code: string; currency: string }) =>
    `${currency.code} - ${currency.currency}`
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

const SuccessChances = () => {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [selectedCurrency, setSelectedCurrency] = useState<
    Record<number, string>
  >({});
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
    }
  };

  const handlePrevious = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Answers:", answers);
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

  const renderDialogContent = () => (
    <form onSubmit={handleSubmit}>
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
                  <div className="flex items-center gap-3 text-black">
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
                  {q.type === "grades" && (
                    <>
                      <select
                        className="w-full rounded-lg border border-gray-300 p-3"
                        value={
                          typeof answers[q.id] === "string" &&
                          (answers[q.id] as string).includes(" - ")
                            ? (answers[q.id] as string).split(" - ")[0]
                            : typeof answers[q.id] === "string"
                            ? (answers[q.id] as string)
                            : ""
                        }
                        onChange={(e) => handleAnswer(e.target.value, q.id)}
                      >
                        <option value="">Select an option</option>
                        {[
                          "Percentage Grade scale",
                          "Grade Point Average (GPA) Scale",
                          "Letter Grade Scale (A-F)",
                          "Pass/Fail",
                          "Any other (Specify)",
                        ].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {answers[q.id] && (
                        <Input
                          type="text"
                          placeholder="Enter your grade/CGPA"
                          className="w-full mt-2"
                          onChange={(e) =>
                            handleAnswer(
                              `${answers[q.id]?.toString().split(" - ")[0]} - ${
                                e.target.value
                              }`,
                              q.id
                            )
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
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
            type={
              currentQuestion === questionGroups.length - 1
                ? "submit"
                : "button"
            }
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={
              currentQuestion === questionGroups.length - 1
                ? undefined
                : handleNext
            }
          >
            {currentQuestion === questionGroups.length - 1 ? "Submit" : "Next"}
            {currentQuestion !== questionGroups.length - 1 && (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-700 text-white px-6 py-6 text-lg">
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-0">
        {showWelcome ? (
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
        ) : (
          renderDialogContent()
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessChances;
