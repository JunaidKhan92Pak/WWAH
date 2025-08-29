"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminCommissionForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    month: "",
    referrals: "",
    amount: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const months = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
  ];
  const statuses = ["Paid", "Pending", "Requested"];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.month ||
      !formData.referrals ||
      !formData.amount ||
      !formData.status
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (!userId) {
      alert("User ID is missing");
      return;
    }

    setLoading(true);

    try {
      // Fixed URL to use NEXT_PUBLIC_BACKEND_API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/commission/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            referrals: Number(formData.referrals),
            amount: Number(formData.amount),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      alert("Commission saved successfully!");
      console.log("Saved commission:", data);
      setFormData({ month: "", referrals: "", amount: "", status: "" });
    } catch (err: unknown) {
      console.error("Error saving commission:", err);
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  console.log("Submitted Data:", formData, "UserId:", userId);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Commission Tracker</CardTitle>
          {userId && <p className="text-sm text-gray-600">User ID: {userId}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Month Dropdown */}
            <div>
              <Label>Month</Label>
              <Select
                onValueChange={(val) => handleChange("month", val)}
                value={formData.month}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Referrals Input */}
            <div>
              <Label>Referrals</Label>
              <Input
                type="number"
                placeholder="Enter number of referrals"
                value={formData.referrals}
                onChange={(e) => handleChange("referrals", e.target.value)}
                min="0"
              />
            </div>

            {/* Amount Input */}
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <Label>Status</Label>
              <Select
                onValueChange={(val) => handleChange("status", val)}
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !userId}
            >
              {loading ? "Saving..." : "Save Commission Record"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
