"use client";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/utils/authHelper";
interface Document {
  id: string;
  name: string;
  files: { name: string; url: string }[];
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
      console.log(response, "response");

      if (!response.ok) throw new Error("Failed to fetch data1");
      else {
        const pdata = await response.json();
        return pdata.documents;
      }
    } catch (error) {
      console.error("❌ Error parsing JSON response:", error);
      throw new Error("Invalid JSON response from server");
    }
  };
  useEffect(() => {
    const getData = async () => {
      const fetchedDocs = await fetchDocuments();
      console.log(fetchedDocs, "fetchedDocs");
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => {
          const matchedDoc = fetchedDocs.find(
            (fetchedDoc: {
              name: string;
              files: { name: string; url: string }[];
              date: string;
            }) => fetchedDoc.name === doc.name
          );
          prevDocs.forEach((doc) => {
            const matchedDoc = fetchedDocs.find(
              (fetchedDoc: {
                name: string;
                files: { name: string; url: string }[];
                date: string;
              }) =>
                fetchedDoc.name.trim().toLowerCase() ===
                doc.name.trim().toLowerCase()
            );

            if (!matchedDoc) {
              console.log(`No match found for: "${doc.name}"`);
            } else {
              console.log(`Matched: "${doc.name}" with "${matchedDoc.name}"`);
            }
          });

          console.log("Prev Docs:", prevDocs);
          console.log("Fetched Docs:", fetchedDocs);
          console.log(matchedDoc, "matched");
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

      const uploadedFiles: { name: string; url: string; public_id: string }[] =
        [];
      console.log("Files to send:", uploadedFiles);

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "world-wide-admissions");

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/djimwwkgl/image/upload`, // ✅ Fix: Correct endpoint
            { method: "POST", body: formData }
          );
          const data = await response.json();
          console.log(data, "data");
          if (!response.ok || !data.secure_url || !data.public_id) {
            throw new Error(
              `Cloudinary upload failed: ${data.error?.message || "Unknown error"
              }`
            );
          }

          uploadedFiles.push({
            name: file.name,
            url: data.secure_url,
            public_id: data.public_id,
          });
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
        }
      }

      if (uploadedFiles.length === 0) {
        alert("No files were successfully uploaded to Cloudinary.");
        return;
      }
      const documentName =
        documents.find((doc) => doc.id === id)?.name || `Document_${id}`;
      const token = getAuthToken(); // Assuming you have this function for authentication
      // 🚀 Send uploaded file metadata to backend
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/uploadDocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adjust auth if needed
            },
            credentials: "include",
            body: JSON.stringify({
              documents: [
                {
                  id,
                  name: documentName,
                  files: uploadedFiles, // ✅ Send Cloudinary metadata, not raw files
                  date: new Date().toISOString(),
                  isChecked: true,
                },
              ],
            }),
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Upload failed");
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === id
              ? {
                ...doc,
                files: [...doc.files, ...uploadedFiles],
                date: new Date().toLocaleDateString(),
                isChecked: true,
              }
              : doc
          )
        );
      } catch (error) {
        console.error("Error uploading to backend:", error);
        alert("Failed to save document on server.");
      }
    },
    []
  );

  interface File {
    name: string;
    url: string;
    _id?: string; // Assuming _id is optional and may exist in the file object
  }

  const handleDelete = async (files: File[]) => {
    console.log(files, "document id and files");

    if (!files || files.length === 0) {
      console.error("Missing document or files.");
      alert("Error: Missing file.");
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

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete document");
      }

      // Fix: Use files[0]._id instead of undefined documentId
      setDocuments(
        documents.map((doc) =>
          doc.id === files[0]._id
            ? { ...doc, files: [], date: "", isChecked: false }
            : doc
        )
      );

      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert((error as Error).message);
    }
  };

  const handleSubmit = async () => {
    // Ensure all documents have name and date
    const validDocuments = documents.map((doc) => ({
      name: doc.name || "Untitled", // Provide a default value if missing
      date: doc.date || new Date().toISOString(), // Set current date if missing
      isChecked: doc.isChecked,
      files: doc.files.map((file) => ({
        name: file.name,
        url: "url" in file ? file.url : "",
      })), // Ensure file objects have name and url
    }));
    console.log(
      "🚀 Documents before sending:",
      JSON.stringify({ documents }, null, 2)
    );
    console.log("Documents being sent:", validDocuments); // Debugging log
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/uploadDocument`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ documents: validDocuments }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save file details to database.");
      }
      alert("Files uploaded and saved successfully!");
    } catch (error) {
      console.error("Error saving document:", error);
    }
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
