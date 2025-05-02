"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
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
export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const data = await res.json();
        console.log("Fetched data:", data);
        console.log(users, "users.phoneNo");
        // Adjust based on your actual response structure
        setUsers(data.Users || data);
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
  console.log(users, "users");
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="flex flex-col items-center bg-[#FCE7D2] min-h-screen p-8"
      style={{
        backgroundImage: "url('/bg-usa.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "crisp-edges",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      {users.length === 0 ? (
        <div>No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Link

              rel="noopener noreferrer"
              href={`/adminportal/dashboard/${user._id}`}
              key={user._id}
            >
              <Card key={user._id} className="w-80">
                <CardHeader>
                  <CardTitle>
                    {user.firstName || "No Name"} {user.lastName || "No Name"}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contact: {user.phone || "N/A"}</p>
                  <p>Nationality: {user.nationality || "N/A"}</p>
                  <p>City: {user.city || "N/A"}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
