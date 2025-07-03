"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Search,
  UserCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Award,
  Plane,
  Home,
  TrendingUp,
  Menu,
  //  ChartAreaIcon,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/useUserData";
//import { Button } from "@/components/ui/button";
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  contactNo?: number;
  nationality?: string;
  city?: string;
  phone?: string;
}
interface ApplicationSummary {
  total: number;
  stages: Record<number, number>;
}
interface Application {
  _id: string;
  user: string;
  countryOfStudy?: string;
  createdAt?: string;
  proficiencyLevel: string;
  status?: string; // We'll determine this based on completeness
  university?: string;
  course?: string;
  applicationStage?: number; // 1-7 for the tracker
}
interface Basic {
  _id: string;
  user: string;
  studyLevel?: string;
  graduationType?: string;
  grade?: number;
  dateOfBirth?: string;
}
interface Document {
  _id: string;
  user: string;
  documents?: [
    {
      type: string;
      url: string;
      name: string;
      uploadedAt: string;
    }
  ]; // Assuming documents is an array of objects
  createdAt?: string;
}
interface ApplicationData {
  Users: User[];
  applications: Application[];
  basics: Basic[];
  documents: Document[];
}
// Application stages configuration
const APPLICATION_STAGES = [
  { id: 1, label: "Complete Application", icon: FileText },
  { id: 2, label: "Applied", icon: CheckCircle },
  { id: 3, label: "Offer Letter Received", icon: Mail },
  { id: 4, label: "Confirm Enrollment", icon: UserCheck },
  { id: 5, label: "Visa Granted", icon: Award },
  { id: 6, label: "Accommodation Booked", icon: Home },
  { id: 7, label: "Airport Pickup Booked", icon: Plane },
];
export default function AdminDashboard() {
  const { logout } = useUserStore();
  const [data, setData] = useState<ApplicationData | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showTracker, setShowTracker] = useState(false);
  const handlelogout = () => {
    logout();
    // Use window.location.href for a full page reload instead of client-side navigation
    window.location.href = "/";
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/studentData`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const responseData = await res.json();
        console.log("Fetched data:", responseData);
        setData(responseData);
        const userData = responseData.Users || responseData;
        setFilteredUsers(userData);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Determine application stage based on available data
  const getApplicationStage = (userId: string) => {
    if (!data) return 1;

    const userApp = data.applications?.find((app) => app.user === userId);
    // const userBasics = data.basics?.find((basic) => basic.user === userId);
    const userDocs = data.documents?.find((doc) => doc.user === userId);

    // Determine stage
    if ((userDocs?.documents?.length ?? 0) > 0) return 2;
    if (userApp && userApp.proficiencyLevel) return 1;
    return 1;
  };

  // Get application status summary

  const getApplicationSummary = (): ApplicationSummary => {
    if (!data) return { total: 0, stages: {} };

    // Tell TS that `stages` is a map from number → number
    const stages: Record<number, number> = {};

    APPLICATION_STAGES.forEach((stage) => {
      stages[stage.id] = 0;
    });

    data.Users.forEach((user) => {
      const stage = getApplicationStage(user._id);
      stages[stage] = (stages[stage] || 0) + 1;
    });

    const total = data.Users.length;
    return { total, stages };
  };

  // Filter users based on search term, nationality, and status
  useEffect(() => {
    if (!data) return;

    let filtered = data.Users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (nationalityFilter) {
      filtered = filtered.filter(
        (user) =>
          user.nationality?.toLowerCase() === nationalityFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => {
        const stage = getApplicationStage(user._id);
        return stage.toString() === statusFilter;
      });
    }

    setFilteredUsers(filtered);
  }, [searchTerm, nationalityFilter, statusFilter, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Students
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch student data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = getApplicationSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all student profiles & applications
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div>
                <button
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${showTracker
                      ? "bg-yellow-600 text-white hover:bg-red-700"
                      : "bg-white text-red-600   hover:bg-red-50"
                    }`}
                >
                  <Link href={"/adminportal/chatPage"}>
                    <MessageCircle />
                  </Link>
                </button>
              </div>
              <button
                onClick={() => setShowTracker(!showTracker)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${showTracker
                    ? "bg-yellow-600 text-white hover:bg-red-700"
                    : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
                  }`}
              >
                <TrendingUp className="w-5 h-5" />
                {showTracker ? "Hide Tracker" : "Show Tracker"}
              </button>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  <span className="font-semibold">
                    {filteredUsers.length} Students
                  </span>
                </div>
              </div>
              {/* <div className="rounded-md border-red-500 border-2 flex p-2 items-center" >
                <Menu className="text-red-600" />
                
              </div> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="rounded-md border-red-500 border-2 flex p-2 items-center cursor-pointer">
                    <Menu className="text-red-600" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-30 mx-2">
                  <DropdownMenuItem
                    onClick={() => console.log("Inbox clicked")}
                  >
                    Inbox
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlelogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Application Status Tracker */}
        {showTracker && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Application Status Overview
              </h2>
              <div className="text-sm text-gray-600">
                Total Applications: {summary.total}
              </div>
            </div>

            {/* Status Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-6">
              {APPLICATION_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const count = summary.stages[stage.id] || 0;
                const percentage =
                  summary.total > 0 ? (count / summary.total) * 100 : 0;

                return (
                  <div
                    key={stage.id}
                    className="relative bg-gradient-to-br from-gray-50 to-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === stage.id.toString()
                          ? ""
                          : stage.id.toString()
                      )
                    }
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${count > 0
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {count}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {stage.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>

                    {/* Progress line */}
                    {index < APPLICATION_STAGES.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-200 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-gray-400 absolute -top-2 left-0" />
                      </div>
                    )}

                    {statusFilter === stage.id.toString() && (
                      <div className="absolute inset-0 bg-yellow-500 bg-opacity-10 rounded-lg border-2 border-yellow-500"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all bg-white min-w-48"
              >
                <option value="">All Stages</option>
                {APPLICATION_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id.toString()}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || nationalityFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setNationalityFilter("");
                  setStatusFilter("");
                }}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUsers.length} of {data?.Users.length || 0} students
            {searchTerm && (
              <span className="ml-2 text-yellow-600 font-medium">
                matching &quot;{searchTerm}&quot;
              </span>
            )}
            {nationalityFilter && (
              <span className="ml-2 text-red-600 font-medium">
                from {nationalityFilter}
              </span>
            )}
            {statusFilter && (
              <span className="ml-2 text-green-600 font-medium">
                at stage:{" "}
                {
                  APPLICATION_STAGES.find(
                    (s) => s.id.toString() === statusFilter
                  )?.label
                }
              </span>
            )}
          </p>
        </div>

        {/* Students Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || nationalityFilter || statusFilter
                ? "Try adjusting your search criteria or filters."
                : "No student data is currently available."}
            </p>
            {(searchTerm || nationalityFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setNationalityFilter("");
                  setStatusFilter("");
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => {
              const applicationStage = getApplicationStage(user._id);
              const currentStage = APPLICATION_STAGES.find(
                (s) => s.id === applicationStage
              );

              return (
                <Link
                  key={user._id}
                  href={`/adminportal/dashboard/${user._id}`}
                  className="group block"
                >
                  <div className="h-full bg-white rounded-xl shadow-sm border-2 hover:border-yellow-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-yellow-50">
                    <div className="p-6 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.name || "No Name"}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-500 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                      </div>
                    </div>

                    <div className="px-6 pb-6 space-y-3">
                      {/* Application Status */}
                      {currentStage && (
                        <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-3 border border-yellow-100">
                          <div className="flex items-center gap-2">
                            <currentStage.icon className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-700">
                              Stage {applicationStage}: {currentStage.label}
                            </span>
                          </div>
                          <div className="mt-2 bg-white bg-opacity-60 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${(applicationStage /
                                    APPLICATION_STAGES.length) *
                                  100
                                  }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {user.phone || user.contactNo ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone || user.contactNo || "N/A"}</span>
                        </div>
                      ) : null}

                      {user.nationality && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{user.nationality}</span>
                        </div>
                      )}

                      {user.city && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{user.city}</span>
                        </div>
                      )}

                      {/* Action indicator */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">View Profile</span>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full group-hover:bg-yellow-600 transition-colors"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
