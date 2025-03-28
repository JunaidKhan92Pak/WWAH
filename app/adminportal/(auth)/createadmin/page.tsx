"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "@/app/(auth)/auth/authProvider";
// import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
  const { setUser, loading } = useUserStore();
  const { createAdminAction } = useAuth();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
console.log(errors);
  // Example usage of errors state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value, "e.target.value");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await createAdminAction(formData);
      if (res.success) {
        setUser(res.user);
        router.push("/adminportal");
        alert("Admin created successfully");
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: res.message, // Correct reference of res.message
        }));
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="create-admin-page">
      <h1>Create New Admin</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full md:w-[60%] lg:w-[40%] xl:w-[30%] mt-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
          onChange={handleChange}
          required
        />
        <Button
          className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base pl-10 w-full rounded-lg py-5 md:py-6 border border-gray-300"
          type="submit"
        >
          {loading ? "Processing..." : "Create Admin"}
        </Button>
      </form>
    </div>
  );
}
