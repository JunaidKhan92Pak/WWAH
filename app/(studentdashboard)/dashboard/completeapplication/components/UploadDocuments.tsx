"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

interface Document {
  id: string;
  name: string;
  files: File[];
  date: string;
  isChecked: boolean;
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Valid Passport", files: [], date: "", isChecked: false },
    {
      id: "2",
      name: "National ID Card",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "3",
      name: "Passport Size Photograph",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "4",
      name: "Academic Marksheet of 10th Grade",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "5",
      name: "Academic Marksheet of 12th Grade",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "6",
      name: "Academic Marksheet of Bachelors",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "7",
      name: "Academic Marksheet of Masters",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "8",
      name: "Academic Degree/Certificates of 10th Grade",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "9",
      name: "Academic Degree/Certificates of 12th Grade",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "10",
      name: "Academic Degree/Certificates of Bachelors",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "11",
      name: "Academic Degree/Certificates of Masters",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "12",
      name: "English Language Proficiency Test Certificate",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "13",
      name: "Letter of Recommendations",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "14",
      name: "Statement of Purpose",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "15",
      name: "Birth Certificate",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "16",
      name: "Curriculum Vitae/Resume",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "17",
      name: "Portfolio (For creative courses such as art, design and architecture)",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "18",
      name: "Translation (if your documents are not in English)",
      files: [],
      date: "",
      isChecked: false,
    },
    {
      id: "19",
      name: "Standardized Test Result (If any)",
      files: [],
      date: "",
      isChecked: false,
    },
  ]);

  const handleFileUpload = async (
    id: string,
    selectedFiles: FileList | null
  ) => {
    if (!selectedFiles) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const newFiles = Array.from(selectedFiles);

    // Validate each file
    const validFiles = newFiles.filter(
      (file) => validTypes.includes(file.type) && file.size <= 30 * 1024 * 1024
    );

    if (validFiles.length !== newFiles.length) {
      alert(
        "Some files were invalid. Please upload valid files (JPG, PNG, PDF, DOCX) with a size less than 30MB."
      );
    }

    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            files: [...doc.files, ...validFiles],
            date: new Date().toLocaleDateString(),
            isChecked: true,
          };
        }
        return doc;
      })
    );
  };

  const handleDelete = (id: string) => {
    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            files: [],
            date: "",
            isChecked: false,
          };
        }
        return doc;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        <div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              The uploaded file type needs to be *.jpg,*.jpeg,*.png,*, Pdf*,
              DOC/DOCX*. Size should not be more than 30 MB. All the documents
              should be 300 DPI scanned.
            </p>
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between p-2 bg-white border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={doc.isChecked}
                    onCheckedChange={() => {}}
                    className="h-4 w-4"
                  />
                  <div className="space-y-1">
                    <p className="text-base">{doc.name}</p>
                    {doc.files.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileIcon className="h-4 w-4" />
                        <span className="text-xs">
                          {doc.files.map((file) => file.name).join(", ")}
                        </span>
                        <span className="text-xs">{doc.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end sm:justify-normal">
                  <Input
                    type="file"
                    className="hidden"
                    id={`file-${doc.id}`}
                    onChange={(e) => handleFileUpload(doc.id, e.target.files)}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    multiple
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`file-${doc.id}`)?.click()
                    }
                  >
                    Upload
                  </Button>

                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right my-4">
            <Button
              type="submit"
              className="w-1/3 sm:w-[17%] bg-red-600 hover:bg-red-700"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
