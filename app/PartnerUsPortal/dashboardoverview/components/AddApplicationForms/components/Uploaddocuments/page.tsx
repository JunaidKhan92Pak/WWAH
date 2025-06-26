"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileIcon } from "lucide-react";

interface UploadedFile {
  name: string;
  date: string;
  file: File;
  checked: boolean;
}

const DOCUMENT_TYPES = [
  "Valid Passport",
  "National ID Card",
  "Passport Size Photograph",
  "Academic Marksheet of 1oth Grade",
  "Academic Marksheet of 12th Grade",
  "Academic Marksheet of  Bachelors",
  "Academic Marksheet of Masters",
  "Academic Degree/Certificates of 10th Grade",
  "Academic Degree/Certificates of 12th Grade",
  "Academic Degree/Certificates of Bachelors",
  "Bank Statement of 3-6 months",
  "Academic Degree/Certificates of Masters",
  "English Language Proficiency Test Certificate",
  "Letter of Recommendations",
  "Statement of Purpose",
  "Birth Certificate",
  "Curriculum Vitae/Resume",
  "Portfolio (For creative courses such as art, design and architecture)",
  "Translation (if your documents are not in English)",
  "Standardized Test Result (If any)",
];

const Page = () => {
  const [files, setFiles] = useState<(UploadedFile | null)[]>(Array(DOCUMENT_TYPES.length).fill(null));

  const handleFileChange = (index: number, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const newFile: UploadedFile = {
        name: fileList[0].name,
        file: fileList[0],
        date: new Date().toISOString().split("T")[0],
        checked: true,
      };

      const updatedFiles = [...files];
      updatedFiles[index] = newFile;
      setFiles(updatedFiles);

      window.alert("File uploaded successfully!");
    }
  };

  const handleDelete = (index: number) => {
    if (!files[index]) {
      window.alert("No files to delete.");
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);

    window.alert("Document deleted successfully!");
  };

  const handleEdit = (index: number) => {
    if (!files[index]) {
      window.alert("Please upload a document before editing.");
      return;
    }

    document.getElementById(`file-${index}`)?.click();
    window.alert(`Ready to edit document for "${DOCUMENT_TYPES[index]}"`);
  };

  const handleCheckChange = (index: number, value: boolean) => {
    const updatedFiles = [...files];
    if (updatedFiles[index]) {
      updatedFiles[index] = {
        ...updatedFiles[index]!,
        checked: value,
      };
      setFiles(updatedFiles);
    }
  };

  return (
    <div>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600">
          The uploaded file type needs to be *.jpg,*.jpeg,*.png,*.pdf,*.doc/.docx. Size should not be more than 30 MB.
          All the documents should be 300 DPI scanned.
        </p>
      </div>

      <div className="space-y-4">
        {DOCUMENT_TYPES.map((docTitle, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between p-3 bg-[#D9D9D929] rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={files[i]?.checked || false}
                onCheckedChange={(checked) => handleCheckChange(i, Boolean(checked))}
                className="h-4 w-4"
              />
              <div className="space-y-1">
                <p className="text-sm">{docTitle}</p>
                {files[i] && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FileIcon className="h-4 w-4" />
                    <span className="text-xs">{files[i]!.name}</span>
                    <span className="text-xs">{files[i]!.date}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 justify-end sm:justify-normal">
              <Input
                type="file"
                id={`file-${i}`}
                className="hidden"
                onChange={(e) => handleFileChange(i, e.target.files)}
              />

              <Button
                variant="outline"
                className="rounded-md px-4 text-sm"
                onClick={() => document.getElementById(`file-${i}`)?.click()}
              >
                Upload
              </Button>

              {/* <Button
                variant="outline"
                className="rounded-md px-4 text-sm"
                disabled={!files[i]} // disable if no file uploaded
                onClick={() => handleEdit(i)}
              >
                Edit
              </Button> */}
             <Button
  variant="outline"
  className="rounded-md px-4 text-sm"
  onClick={() => handleEdit(i)}
>
  Edit
</Button>

              <Button
                className="bg-[#FCE7D2] text-red-600 hover:bg-[#fceddd] rounded-md px-4 text-sm"
                onClick={() => handleDelete(i)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
