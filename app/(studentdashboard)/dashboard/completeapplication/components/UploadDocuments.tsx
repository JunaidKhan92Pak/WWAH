"use client";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/utils/authHelper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface Document {
  id: string;
  name: string;
  files: { name: string; url: string; _id: string }[];
  date: string;
  isChecked: boolean;
}

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Document Uploaded Successfully"
  );
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Valid Passport", files: [], date: "", isChecked: false },
    { id: "2", name: "National ID Card", files: [], date: "", isChecked: false, },
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

  const fetchDocuments = async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getDocuments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data1");
      const pdata = await response.json();
      return pdata.documents;
    } catch (error) {
      console.error("❌ Error parsing JSON response:", error);
      throw new Error("Invalid JSON response from server");
    }
  };

  useEffect(() => {
    const getData = async () => {
      const fetchedDocs = await fetchDocuments();
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => {
          const matchedDoc = fetchedDocs.find(
            (fetchedDoc: {
              name: string;
              files: { name: string; url: string }[];
              date: string;
            }) =>
              fetchedDoc.name.trim().toLowerCase() ===
              doc.name.trim().toLowerCase()
          );

          return matchedDoc
            ? {
              ...doc,
              files: matchedDoc.files || [],
              date: matchedDoc.date || "",
              isChecked: matchedDoc.files.length > 0,
            }
            : doc;
        })
      );
    };

    getData();
  }, []);

  const handleFileUpload = useCallback(
    async (id: string, selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const validTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          validTypes.includes(file.type) && file.size <= 30 * 1024 * 1024
      );

      if (validFiles.length === 0) {
        alert("No valid files selected for upload.");
        return;
      }

      const documentName =
        documents.find((doc) => doc.id === id)?.name || `Document_${id}`;
      const token = getAuthToken();

      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("documentName", documentName);
      formData.append("documentId", id);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/uploadDocument`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
            body: formData,
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Upload failed");

        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === id
              ? {
                ...doc,
                files: result.uploadedFiles,
                date: new Date().toLocaleDateString(),
                isChecked: true,
              }
              : doc
          )
        );

        setSuccessMessage("Upload Document Successful");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error uploading files:", error);
        alert("Failed to upload files");
      }
    },
    [documents]
  );

  const handleDelete = async (
    files: { name: string; url: string; _id: string }[]
  ) => {
    if (!files || files.length === 0) {
      alert("No files to delete.");
      return;
    }

    const token = getAuthToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/deleteDocument`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete document");

      setDocuments((docs) =>
        docs.map((doc) => ({
          ...doc,
          files: doc.files.filter(
            (file) => !files.some((delFile) => delFile._id === file._id)
          ),
          isChecked:
            doc.files.filter(
              (file) => !files.some((delFile) => delFile._id === file._id)
            ).length > 0,
        }))
      );

      // setSuccessMessage("Document Deleted Successfully");
      setShowSuccessModal(true);
      setShowDeleteModal(true);

    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleSubmit = async () => {
    // alert("file submitted");
    router.push("/dashboard/completeapplication?tab=review")
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
                    onCheckedChange={() => { }}
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
                    onClick={() => handleDelete(doc.files)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
              <Image
                src="/DashboardPage/success.svg"
                alt="Success"
                width={150}
                height={150}
              />
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {successMessage}
                  ly</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <DialogContent className="flex flex-col justify-center items-center  max-w-72 md:max-w-96 !rounded-3xl">
              <Image
                src="/DashboardPage/success.svg"
                alt="Success"
                width={150}
                height={150}
              />
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Document Deleted Successfully!
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>


          <div className="text-right my-4">
            <Button
              onClick={handleSubmit}
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

