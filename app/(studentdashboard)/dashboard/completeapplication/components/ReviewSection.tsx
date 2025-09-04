"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchApplicationInfo, fetchBasicInfo } from "@/utils/stdDashboard";
import { useEffect, useState } from "react";
import { MdModeEditOutline, MdSave, MdCancel, MdAdd, MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";
import toast from "react-hot-toast";
import countries from "world-countries";

// Types
interface FamilyMember {
  name: string;
  relationship: string;
  nationality: string;
  occupation: string;
  email: string;
  phoneNo: string;
}

interface EducationEntry {
  highestDegree: string;
  subjectName: string;
  institutionAttended: string;
  marks: string;
  degreeStartDate: string;
  degreeEndDate: string;
}

interface WorkEntry {
  jobTitle: string;
  organizationName: string;
  employmentType: string;
  from: string;
  to: string;
}

interface Data1Type {
  familyName?: string;
  givenName?: string;
  nationality?: string;
  DOB?: string;
  countryOfResidence?: string;
  gender?: string;
  maritalStatus?: string;
  religion?: string;
  permanentAddress?: string;
  country?: string;
  city?: string;
  currentZipCode?: string;
  zipCode?: string;
  countryCode?: string;
  phoneNo?: string;
  currentAddress?: string;
  currentCountry?: string;
  currentCity?: string;
  currentEmail?: string;
  currentPhoneNo?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  oldPassportNumber?: string;
  oldPassportExpiryDate?: string;
  visitedCountry?: string;
  institution?: string;
  visaType?: string;
  visaExpiryDate?: string;
  durationOfStudyAbroad?: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorsNationality?: string;
  sponsorsOccupation?: string;
  sponsorsEmail?: string;
  email: string;
  sponsorsPhoneNo?: string;
  familyMembers?: FamilyMember[];
}

interface Data2Type {
  countryOfStudy?: string;
  proficiencyLevel?: string;
  proficiencyTest?: string;
  overAllScore?: string;
  listeningScore?: string;
  readingScore?: string;
  writingScore?: string;
  speakingScore?: string;
  educationalBackground?: EducationEntry[];
  workExperience?: WorkEntry[];
  standardizedTest?: string;
  standardizedOverallScore?: string;
  standardizedSubScore?: string[];
}

// Country options
const countryOptions = countries.map((c) => ({
  label: c.name.common,
  value: c.cca2,
  id: c.cca3,
}));

const nationalityOptions = countries.map((c) => ({
  label: c.demonyms?.eng?.m || c.name.common,
  value: c.demonyms?.eng?.m || c.name.common,
}));

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString || dateString === "undefined" || dateString === "null") {
    return "";
  }
  try {
    return new Date(dateString).toLocaleDateString("en-GB");
  } catch {
    return "";
  }
};

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const safeString = (value?: string): string => {
  if (!value || value === "undefined" || value === "null") {
    return "";
  }
  return value;
};

const formatPhoneNumber = (countryCode?: string, phoneNo?: string): string => {
  const code = safeString(countryCode);
  const number = safeString(phoneNo);

  if (!code && !number) return "";
  if (!code) return number;
  if (!number) return code;
  return `${code}-${number}`;
};

// Field type detection
const getFieldType = (fieldKey: string): "text" | "date" | "select" | "textarea" => {
  if (fieldKey.toLowerCase().includes('date') || fieldKey === 'DOB') return "date";
  if (['gender', 'maritalStatus', 'nationality', 'countryOfResidence', 'proficiencyTest', 'employmentType', 'visaType'].includes(fieldKey)) return "select";
  if (['permanentAddress', 'currentAddress'].includes(fieldKey)) return "textarea";
  return "text";
};

// Field options
const getFieldOptions = (fieldKey: string) => {
  switch (fieldKey) {
    case 'gender':
      return [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
        { label: 'Prefer not to say', value: 'Prefer not to say' }
      ];
    case 'maritalStatus':
      return [
        { label: 'Single', value: 'Single' },
        { label: 'Married', value: 'Married' },
        { label: 'Divorced', value: 'Divorced' },
        { label: 'Widowed', value: 'Widowed' },
        { label: 'Separated', value: 'Separated' },
        { label: 'Other', value: 'Other' }
      ];
    case 'nationality':
      return nationalityOptions;
    case 'countryOfResidence':
      return countryOptions.map(c => ({ label: c.label, value: c.label }));
    case 'employmentType':
      return [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Freelance', value: 'Freelance' }
      ];
    case 'proficiencyTest':
      return [
        { label: 'IELTS', value: 'IELTS' },
        { label: 'TOEFL', value: 'TOEFL' },
        { label: 'PTE', value: 'PTE' },
        { label: 'Cambridge', value: 'Cambridge' },
        { label: 'Other', value: 'Other' }
      ];
    case 'visaType':
      return [
        { label: 'Student Visa', value: 'Student Visa' },
        { label: 'Tourist Visa', value: 'Tourist Visa' },
        { label: 'Work Visa', value: 'Work Visa' },
        { label: 'Other', value: 'Other' }
      ];
    default:
      return undefined;
  }
};

// Editable Field Component
interface EditableFieldProps {
  fieldKey: string;
  value: string;
  type?: "text" | "date" | "select" | "textarea";
  options?: Array<{ label: string; value: string }>;
  onSave: (key: string, value: string) => Promise<void>;
  sectionType: "basic" | "application";
  disabled?: boolean;
}

const EditableField = ({ fieldKey, value, type = "text", options, onSave, disabled = false }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(fieldKey, editValue);
      setIsEditing(false);
      toast.success(
        `${capitalizeFirstLetter(fieldKey.replace(/([A-Z])/g, " $1").trim())} updated successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update field");
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (disabled) {
    return <p className="font-medium">{value || ""}</p>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {type === "select" && options ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-h-[60px]"
            disabled={isSaving}
            placeholder="Enter address..."
          />
        ) : (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
            disabled={isSaving}
          />
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1"
        >
          {isSaving ? "..." : <MdSave size={14} />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="px-2 py-1"
        >
          <MdCancel size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between group">
      <p className="font-medium flex-1">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 h-auto"
      >
        <MdModeEditOutline size={16} />
      </Button>
    </div>
  );
};

// Array Field Components
const EditableFamilyMembers = ({ 
  familyMembers, 
  onUpdate 
}: { 
  familyMembers: FamilyMember[], 
  onUpdate: (members: FamilyMember[]) => Promise<void> 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMembers, setEditingMembers] = useState(familyMembers);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditingMembers(familyMembers);
  }, [familyMembers]);

  const addMember = () => {
    setEditingMembers([...editingMembers, {
      name: '',
      relationship: '',
      nationality: '',
      occupation: '',
      email: '',
      phoneNo: ''
    }]);
  };

  const removeMember = (index: number) => {
    setEditingMembers(editingMembers.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...editingMembers];
    updated[index] = { ...updated[index], [field]: value };
    setEditingMembers(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editingMembers);
      setIsEditing(false);
      toast.success("Family members updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update family members");
      setEditingMembers(familyMembers);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingMembers(familyMembers);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {editingMembers.map((member, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Family Member {index + 1}</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeMember(index)}
                className="text-red-600 hover:text-red-700"
              >
                <MdDelete size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Name"
                value={member.name}
                onChange={(e) => updateMember(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Relationship"
                value={member.relationship}
                onChange={(e) => updateMember(index, 'relationship', e.target.value)}
              />
              <Input
                placeholder="Nationality"
                value={member.nationality}
                onChange={(e) => updateMember(index, 'nationality', e.target.value)}
              />
              <Input
                placeholder="Occupation"
                value={member.occupation}
                onChange={(e) => updateMember(index, 'occupation', e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={member.email}
                onChange={(e) => updateMember(index, 'email', e.target.value)}
              />
              <Input
                placeholder="Phone Number"
                value={member.phoneNo}
                onChange={(e) => updateMember(index, 'phoneNo', e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addMember}
            className="flex items-center gap-1"
          >
            <MdAdd size={16} /> Add Member
          </Button>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {familyMembers.length === 0 ? (
        <p className="text-muted-foreground italic">No family members added yet</p>
      ) : (
        familyMembers.map((member, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Name:</span> {member.name}</div>
              <div><span className="font-medium">Relationship:</span> {member.relationship}</div>
              <div><span className="font-medium">Nationality:</span> {member.nationality}</div>
              <div><span className="font-medium">Occupation:</span> {member.occupation}</div>
              <div><span className="font-medium">Email:</span> {member.email}</div>
              <div><span className="font-medium">Phone:</span> {member.phoneNo}</div>
            </div>
          </div>
        ))
      )}
      <Button
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1"
      >
        <MdModeEditOutline size={16} /> Edit Family Members
      </Button>
    </div>
  );
};

const EditableEducationalBackground = ({ 
  educationalBackground, 
  onUpdate 
}: { 
  educationalBackground: EducationEntry[], 
  onUpdate: (education: EducationEntry[]) => Promise<void> 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEducation, setEditingEducation] = useState(educationalBackground);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditingEducation(educationalBackground);
  }, [educationalBackground]);

  const addEducation = () => {
    setEditingEducation([...editingEducation, {
      highestDegree: '',
      subjectName: '',
      institutionAttended: '',
      marks: '',
      degreeStartDate: '',
      degreeEndDate: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEditingEducation(editingEducation.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...editingEducation];
    updated[index] = { ...updated[index], [field]: value };
    setEditingEducation(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editingEducation);
      setIsEditing(false);
      toast.success("Educational background updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update educational background");
      setEditingEducation(educationalBackground);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingEducation(educationalBackground);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {editingEducation.map((education, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Education {index + 1}</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <MdDelete size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Highest Degree"
                value={education.highestDegree}
                onChange={(e) => updateEducation(index, 'highestDegree', e.target.value)}
              />
              <Input
                placeholder="Subject Name"
                value={education.subjectName}
                onChange={(e) => updateEducation(index, 'subjectName', e.target.value)}
              />
              <Input
                placeholder="Institution Attended"
                value={education.institutionAttended}
                onChange={(e) => updateEducation(index, 'institutionAttended', e.target.value)}
              />
              <Input
                placeholder="CGPA/Marks"
                value={education.marks}
                onChange={(e) => updateEducation(index, 'marks', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Start Date"
                value={education.degreeStartDate}
                onChange={(e) => updateEducation(index, 'degreeStartDate', e.target.value)}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={education.degreeEndDate}
                onChange={(e) => updateEducation(index, 'degreeEndDate', e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="flex items-center gap-1"
          >
            <MdAdd size={16} /> Add Education
          </Button>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educationalBackground.length === 0 ? (
        <p className="text-muted-foreground italic">No educational background added yet</p>
      ) : (
        educationalBackground.map((education, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Degree:</span> {education.highestDegree}</div>
              <div><span className="font-medium">Subject:</span> {education.subjectName}</div>
              <div><span className="font-medium">Institution:</span> {education.institutionAttended}</div>
              <div><span className="font-medium">CGPA/Marks:</span> {education.marks}</div>
              <div><span className="font-medium">Start Date:</span> {formatDate(education.degreeStartDate)}</div>
              <div><span className="font-medium">End Date:</span> {formatDate(education.degreeEndDate)}</div>
            </div>
          </div>
        ))
      )}
      <Button
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1"
      >
        <MdModeEditOutline size={16} /> Edit Educational Background
      </Button>
    </div>
  );
};

const EditableWorkExperience = ({ 
  workExperience, 
  onUpdate 
}: { 
  workExperience: WorkEntry[], 
  onUpdate: (work: WorkEntry[]) => Promise<void> 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingWork, setEditingWork] = useState(workExperience);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditingWork(workExperience);
  }, [workExperience]);

  const addWork = () => {
    setEditingWork([...editingWork, {
      jobTitle: '',
      organizationName: '',
      employmentType: '',
      from: '',
      to: ''
    }]);
  };

  const removeWork = (index: number) => {
    setEditingWork(editingWork.filter((_, i) => i !== index));
  };

  const updateWork = (index: number, field: string, value: string) => {
    const updated = [...editingWork];
    updated[index] = { ...updated[index], [field]: value };
    setEditingWork(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editingWork);
      setIsEditing(false);
      toast.success("Work experience updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update work experience");
      setEditingWork(workExperience);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingWork(workExperience);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {editingWork.map((work, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Work Experience {index + 1}</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeWork(index)}
                className="text-red-600 hover:text-red-700"
              >
                <MdDelete size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Job Title"
                value={work.jobTitle}
                onChange={(e) => updateWork(index, 'jobTitle', e.target.value)}
              />
              <Input
                placeholder="Organization Name"
                value={work.organizationName}
                onChange={(e) => updateWork(index, 'organizationName', e.target.value)}
              />
              <Select
                value={work.employmentType}
                onValueChange={(value) => updateWork(index, 'employmentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullTime">Full-time</SelectItem>
                  <SelectItem value="partTime">Part-time</SelectItem>
                </SelectContent>
              </Select>
              <div></div>
              <Input
                type="date"
                placeholder="Start Date"
                value={work.from}
                onChange={(e) => updateWork(index, 'from', e.target.value)}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={work.to}
                onChange={(e) => updateWork(index, 'to', e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addWork}
            className="flex items-center gap-1"
          >
            <MdAdd size={16} /> Add Work Experience
          </Button>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workExperience.length === 0 ? (
        <p className="text-muted-foreground italic">No work experience added yet</p>
      ) : (
        workExperience.map((work, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Job Title:</span> {work.jobTitle}</div>
              <div><span className="font-medium">Organization:</span> {work.organizationName}</div>
              <div><span className="font-medium">Employment Type:</span> {work.employmentType}</div>
              <div></div>
              <div><span className="font-medium">Start Date:</span> {formatDate(work.from)}</div>
              <div><span className="font-medium">End Date:</span> {formatDate(work.to)}</div>
            </div>
          </div>
        ))
      )}
      <Button
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1"
      >
        <MdModeEditOutline size={16} /> Edit Work Experience
      </Button>
    </div>
  );
};

// Section Component
const Section = ({
  title,
  data,
  children,
  sectionType,
  onFieldUpdate,
  onBulkEdit,
}: {
  title: string;
  data?: Record<string, string>;
  children?: React.ReactNode;
  sectionType?: "basic" | "application";
  onFieldUpdate?: (key: string, value: string) => Promise<void>;
  onBulkEdit?: () => void;
}) => (
  <div className="mb-8 w-full">
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-row items-center whitespace-nowrap rounded-lg p-2 bg-[#F4D0D2]">
        <p className="font-semibold">{title}</p>
      </div>
      {onBulkEdit && (
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={onBulkEdit}
        >
          Edit All <MdModeEditOutline />
        </Button>
      )}
    </div>
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        {data &&
          onFieldUpdate &&
          sectionType &&
          Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
            >
              <p className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <EditableField
                fieldKey={key}
                value={value}
                type={getFieldType(key)}
                options={getFieldOptions(key)}
                onSave={onFieldUpdate}
                sectionType={sectionType}
              />
            </div>
          ))}
        {children}
      </div>
    </div>
  </div>
);

// Main Review Page Component
export default function ReviewPage() {
  const router = useRouter();
  const [data1, setData1] = useState<Data1Type | null>(null);
  const [data2, setData2] = useState<Data2Type | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const result1 = await fetchBasicInfo();
        const result2 = await fetchApplicationInfo();
        setData1(result1);
        setData2(result2);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load application data");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  // API update functions
  const updateBasicInfoField = async (fieldKey: string, value: string) => {
    try {
      const token = getAuthToken();
      const updatePayload = { [fieldKey]: value };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/updateBasicInfoField`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem('basic-info-form');
        // localStorage.removeItem("application-info-current-page")
        // setData1((prev) => ({ ...prev, [fieldKey]: value }));
        setData1((prev) => ({ ...prev, [fieldKey]: value, email: prev?.email ?? "" }));
      } else {
        throw new Error(result.message || "Failed to update field");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      throw error;
    }
  };

  const updateApplicationInfoField = async (fieldKey: string, value: string) => {
    try {
      const token = getAuthToken();
      const updatePayload = { [fieldKey]: value };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/updateApplicationInfoField`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem("application-info-current-page")
        localStorage.removeItem("application-info-form")
        setData2((prev) => ({ ...prev, [fieldKey]: value }));
      } else {
        throw new Error(result.message || "Failed to update field");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      throw error;
    }
  };

  // Array update functions
  const updateFamilyMembers = async (members: FamilyMember[]) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/updateFamilyMembers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ familyMembers: members }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem('basic-info-form');
        // localStorage.removeItem("application-info-current-page")
        setData1((prev) => ({ ...prev, familyMembers: members, email: prev?.email ?? "" }));
      } else {
        throw new Error(result.message || "Failed to update family members");
      }
    } catch (error) {
      console.error("Error updating family members:", error);
      throw error;
    }
  };

  const updateEducationalBackground = async (education: EducationEntry[]) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/updateEducationalBackground`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ educationalBackground: education }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        // localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem("application-info-current-page")
        localStorage.removeItem("application-info-form")
        setData2((prev) => ({ ...prev, educationalBackground: education }));
      } else {
        throw new Error(result.message || "Failed to update educational background");
      }
    } catch (error) {
      console.error("Error updating educational background:", error);
      throw error;
    }
  };

  const updateWorkExperience = async (work: WorkEntry[]) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/updateWorkExperience`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ workExperience: work }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setData2((prev) => ({ ...prev, workExperience: work }));
        localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem('basic-info-form');
      } else {
        throw new Error(result.message || "Failed to update work experience");
      }
    } catch (error) {
      console.error("Error updating work experience:", error);
      throw error;
    }
  };

  // Navigation function with localStorage override
  const navigateToEditPage = (tab: string, step: string) => {
    const url = `/dashboard/completeapplication?tab=${tab}&step=${step}&override=true`;
    router.push(url);
  };

  // Final submission function
  const handleFinalSubmission = async () => {
    if (!data1 || !data2) {
      toast.error("Application data not loaded");
      return;
    }

    setIsSubmittingFinal(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/finalSubmission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            basicInfo: data1,
            applicationInfo: data2,
            submittedAt: new Date().toISOString()
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        toast.success("Application submitted successfully!");
        // Clear localStorage data
        // localStorage.clear();
        localStorage.removeItem('basic-info-current-page');
        localStorage.removeItem('basic-info-form');
        localStorage.removeItem("application-info-current-page")
        localStorage.removeItem("application-info-form")
        // Redirect to confirmation page
        // router.push("/dashboard/applica");
      } else {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!data1 || !data2) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Failed to load application data. Please refresh the page.</p>
      </div>
    );
  }

  const studentData = {
    personalInfo: {
      familyName: safeString(data1?.familyName),
      givenName: safeString(data1?.givenName),
      nationality: safeString(data1?.nationality),
      dateOfBirth: formatDate(data1?.DOB),
      countryOfResidence: safeString(data1?.countryOfResidence),
      gender: safeString(data1?.gender),
      maritalStatus: safeString(data1?.maritalStatus),
      religion: safeString(data1?.religion),
  
    },
    contactDetails: {
      permanentAddress: safeString(data1?.permanentAddress),
      currentAddress: safeString(data1?.currentAddress),
      city: safeString(data1?.city),
      zipCode: safeString(data1?.zipCode),
      email: safeString(data1?.email),
      phoneNumber: formatPhoneNumber(data1?.countryCode, data1?.phoneNo),
    },
    passportInfo: {
      passportNumber: safeString(data1?.passportNumber),
      passportExpiryDate: formatDate(data1?.passportExpiryDate),
      oldPassportNumber: safeString(data1?.oldPassportNumber),
      oldPassportExpiryDate: formatDate(data1?.oldPassportExpiryDate),
    },
    learningExperienceAbroad: {
      visitedCountry: safeString(data1?.visitedCountry),
      institution: safeString(data1?.institution),
      visaType: safeString(data1?.visaType),
      visaExpiryDate: formatDate(data1?.visaExpiryDate),
      durationOfStudy: safeString(data1?.durationOfStudyAbroad),
    },
    financialSponsorInfo: {
      sponsorName: safeString(data1?.sponsorName),
      relationshipWithStudent: safeString(data1?.sponsorRelationship),
      sponsorsNationality: safeString(data1?.sponsorsNationality),
      sponsorsOccupation: safeString(data1?.sponsorsOccupation),
      sponsorsEmail: safeString(data1?.sponsorsEmail),
      sponsorsPhoneNo: formatPhoneNumber(data1?.countryCode, data1?.sponsorsPhoneNo),
    },
    languageProficiency: {
      proficiencyTest: safeString(data2?.proficiencyTest),
      overallScore: safeString(data2?.overAllScore),
      listeningScore: safeString(data2?.listeningScore),
      readingScore: safeString(data2?.readingScore),
      writingScore: safeString(data2?.writingScore),
      speakingScore: safeString(data2?.speakingScore),
    },
    standardizedTests: {
      standardizedTest: safeString(data2?.standardizedTest),
      standardizedOverallScore: safeString(data2?.standardizedOverallScore),
      // standardizedSubScore: data2?.standardizedSubScore?.map(score => score.toString()).join(", ")|| "",
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit Application</h1>
          <p className="text-gray-600">Please review all information carefully before final submission</p>
        </div>

        {/* Personal Information Section */}
        <Section
          title="Personal Information"
          data={studentData.personalInfo}
          sectionType="basic"
          onFieldUpdate={updateBasicInfoField}
          onBulkEdit={() => navigateToEditPage("basicinfo", "1")}
        />

        {/* Contact Details Section */}
        <Section
          title="Contact Details"
          data={studentData.contactDetails}
          sectionType="basic"
          onFieldUpdate={updateBasicInfoField}
          onBulkEdit={() => navigateToEditPage("basicinfo", "2")}
        />

        {/* Passport Information Section */}
        <Section
          title="Passport Information"
          data={studentData.passportInfo}
          sectionType="basic"
          onFieldUpdate={updateBasicInfoField}
          onBulkEdit={() => navigateToEditPage("basicinfo", "3")}
        />

        {/* Learning Experience Abroad Section */}
        <Section
          title="Learning Experience Abroad"
          data={studentData.learningExperienceAbroad}
          sectionType="basic"
          onFieldUpdate={updateBasicInfoField}
          onBulkEdit={() => navigateToEditPage("basicinfo", "4")}
        />

        {/* Financial Sponsor Information Section */}
        <Section
          title="Financial Sponsor Information"
          data={studentData.financialSponsorInfo}
          sectionType="basic"
          onFieldUpdate={updateBasicInfoField}
          onBulkEdit={() => navigateToEditPage("basicinfo", "5")}
        />

        {/* Family Members Section */}
        <Section title="Family Members" onBulkEdit={() => navigateToEditPage("basicinfo", "6")}>
          <EditableFamilyMembers
            familyMembers={data1?.familyMembers || []}
            onUpdate={updateFamilyMembers}
          />
        </Section>

        {/* Educational Background Section */}
        <Section title="Educational Background" onBulkEdit={() => navigateToEditPage("appinfo", "1")}>
          <EditableEducationalBackground
            educationalBackground={data2?.educationalBackground || []}
            onUpdate={updateEducationalBackground}
          />
        </Section>

        {/* Work Experience Section */}
        <Section title="Work Experience" onBulkEdit={() => navigateToEditPage("appinfo", "2")}>
          <EditableWorkExperience
            workExperience={data2?.workExperience || []}
            onUpdate={updateWorkExperience}
          />
        </Section>

        {/* Language Proficiency Section */}
        <Section
          title="Language Proficiency"
          data={studentData.languageProficiency}
          sectionType="application"
          onFieldUpdate={updateApplicationInfoField}
          onBulkEdit={() => navigateToEditPage("appinfo", "3")}
        />

        {/* Standardized Test Section */}
        <Section
          title="Standardized Test"
          data={studentData.standardizedTests}
          sectionType="application"
          onFieldUpdate={updateApplicationInfoField}
          onBulkEdit={() => navigateToEditPage("appinfo", "4")}
        />

        {/* Final Submission Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Final Submission</h3>
          <div className="space-y-4">
            {/* <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge. 
                I understand that any false or misleading information may result in the rejection of my application or cancellation of admission.
              </label>
            </div> */}
{/*             
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I agree to the processing of my personal data in accordance with the Privacy Policy and consent to background verification if required.
              </label>
            </div> */}

            <div className="pt-4">
              <Button
                onClick={handleFinalSubmission}
                disabled={isSubmittingFinal}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                {isSubmittingFinal ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  "Submit Final Application"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        {/* <div className="mt-8 flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <span>← Go Back</span>
          </Button>
          
          <div className="text-sm text-gray-500">
            Last saved: {new Date().toLocaleString()}
          </div>
        </div> */}
      </div>
    </div>
  );
}