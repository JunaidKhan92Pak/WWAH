"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ImageWithLoader from "@/components/ImageWithLoader";
import { SkeletonCard } from "@/components/skeleton";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import { getAuthToken } from "@/utils/authHelper";
import { useRouter } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  course_title: string;
  universityData: {
    university_name: string;
    universityImages: {
      banner: string;
      logo: string;
    };
  };
  countryname: string;
  intake: string;
  duration: string;
  annual_tuition_fee: {
    currency: string;
    amount: string;
  };
}

const FavoriteCourse = () => {
  const [favorites, setFavorites] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const { user, fetchUserProfile } = useUserStore();
  const router = useRouter();

  const showLoginPrompt = () => {
    toast.error("Please login to add courses to your favorites!", {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #fecaca",
      },
    });
  };

  // ✅ Function to add a course to applied courses
  const addToAppliedCourses = async (courseId: unknown) => {
    const token = getAuthToken();

    if (!token) {
      showLoginPrompt();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action: "add",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add course to applied courses");
      }

      const data = await response.json();
      // console.log("Course added to applied courses:", data);
      toast.success("Course added to applied courses!", {
        duration: 2000,
        position: "top-center",
      });
      router.push("/dashboard/overview");

      return data;
    } catch (error) {
      console.error("Error adding course to applied courses:", error);
      toast.error("Failed to add course. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
      throw error;
    }
  };

  // Remove favorite with proper backend integration
  const removeFavorite = async (courseId: string) => {
    setRemovingId(courseId);

    try {
      const token = getAuthToken();

      // Call the same backend endpoint as CourseArchive
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}favorites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action: "remove",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      const data = await response.json();
      // console.log("Favorite removed successfully", data);

      if (data.success) {
        // Update local state immediately for better UX
        setFavorites((prev) =>
          prev.filter((course) => course._id !== courseId)
        );

        // Refresh user profile to sync with backend
        await fetchUserProfile();

        toast.success("Course removed from favorites!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        throw new Error(data.message || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        {
          duration: 3000,
          position: "top-center",
        }
      );
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      // Reset states
      setLoading(true);
      setError(null);

      try {
        // Check if user exists and has favorite courses
        if (!user) {
          // console.log("No user found");
          setFavorites([]);
          return;
        }

        const favoriteIds = (user?.favouriteCourse ||
          []) as unknown as string[];
        // console.log("User favorite course IDs:", favoriteIds);

        if (favoriteIds.length === 0) {
          // console.log("No favorite courses found for user");
          setFavorites([]);
          return;
        }

        // Validate that all IDs are valid strings
        const validIds = favoriteIds.filter(
          (id) => id && typeof id === "string" && id.trim().length > 0
        );

        if (validIds.length === 0) {
          // console.log("No valid favorite course IDs found");
          setFavorites([]);
          return;
        }

        // Convert array of IDs to comma-separated string
        const idsString = validIds.join(",");
        // console.log("Fetching courses with IDs:", idsString);

        const response = await fetch(
          `/api/getfavouritecourse?ids=${encodeURIComponent(idsString)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("API Response:", data);

        if (data.success) {
          setFavorites(data.favouriteCourses || []);
        } else {
          setError(data.message || "Failed to load favorite courses");
        }
      } catch (error) {
        console.error("Error fetching favorite courses:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load favorite courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]); // Re-fetch when user data changes

  // Fetch user profile on component mount if not already loaded
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, user]);

  if (loading) return <SkeletonCard arr={8} />;

  if (error) {
    return (
      <section className="w-[95%] mx-auto p-2">
        <div className="text-center py-20">
          <div className="text-red-500 text-xl font-semibold mb-4">
            Error Loading Favorites
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-[95%] mx-auto p-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Favorite Courses</h1>
        <p className="text-gray-600">{favorites.length} Favourited Courses</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Image
            src="/hearti.svg"
            width={60}
            height={60}
            alt="No favorites"
            className="mx-auto mb-4 opacity-50"
          />
          <p className="text-xl font-semibold text-gray-500">
            No favorite courses yet
          </p>
          <p className="text-gray-400 mt-2 mb-4">
            Start exploring courses and add them to your favorites!
          </p>
          <Link
            href="/coursearchive"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:p-0">
          {favorites.map((item, idx) => (
            <div
              key={item._id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3"
            >
              <div className="relative h-52 p-2">
                <Link
                  // target="_blank"
                  href={`/courses/${item._id}`}
                  // rel="noopener noreferrer"
                  className="w-full block"
                >
                  <ImageWithLoader
                    src={
                      item.universityData?.universityImages?.banner ||
                      `/course-${(idx % 10) + 1}.png`
                    }
                    alt="coursesImg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                    className="object-cover rounded-2xl w-full h-full"
                  />
                </Link>

                <div className="absolute top-4 left-0">
                  <div className="bg-gradient-to-r from-white to-transparent opacity-100 w-[60%] pr-8">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          item.universityData?.universityImages?.logo ||
                          "/logo.png"
                        }
                        alt="university logo"
                        className="w-12 h-12 object-cover object-center rounded-full aspect-square"
                      />
                      <div className="py-1">
                        <p className="leading-none text-sm font-medium cursor-pointer">
                          {item.universityData?.university_name || "University"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-gray-200 bg-opacity-40 backdrop-blur-sm rounded-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <Image
                          src="/university/Share.svg"
                          width={21}
                          height={21}
                          alt="Share"
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                          Anyone who has this link will be able to view this.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label
                            htmlFor={`link-${item._id}`}
                            className="sr-only"
                          >
                            Link
                          </Label>
                          <Input
                            id={`link-${item._id}`}
                            value={`${typeof window !== "undefined"
                              ? window.location.origin
                              : ""
                              }/courses/${item._id}`}
                            readOnly
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="px-3"
                          onClick={() => {
                            const link = `${window.location.origin}/courses/${item._id}`;
                            navigator.clipboard.writeText(link).then(() => {
                              setCopiedLinkId(item._id);
                              setTimeout(() => setCopiedLinkId(null), 2000);
                            });
                          }}
                        >
                          <span className="sr-only">Copy</span>
                          <Copy />
                        </Button>
                      </div>

                      {copiedLinkId === item._id && (
                        <p className="text-black text-sm mt-2">
                          Link copied to clipboard!
                        </p>
                      )}

                      <div className="mt-2 flex gap-4 justify-left">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `${window.location.origin}/courses/${item._id}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          <BsWhatsapp className="text-2xl" />{" "}
                        </a>
                        <a
                          href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                            `${window.location.origin}/courses/${item._id}`
                          )}`}
                          className="text-blue-600 hover:underline"
                        >
                          <AiOutlineMail className="text-2xl text-red-600" />{" "}
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            `${window.location.origin}/courses/${item._id}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1877F2] hover:underline"
                        >
                          <FaFacebook className="text-blue-600 text-2xl" />
                        </a>
                      </div>

                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <button
                    onClick={() => removeFavorite(item._id)}
                    disabled={removingId === item._id}
                    className={`transition-opacity ${removingId === item._id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-80"
                      }`}
                    title="Remove from favorites"
                  >
                    {removingId === item._id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Image
                        src="/redheart.svg"
                        width={20}
                        height={20}
                        alt="Remove Favorite"
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow">
                <Link
                  // target="_blank"
                  href={`/courses/${item._id}`}
                // rel="noopener noreferrer"
                >
                  <h3
                    className="text-base md:text-lg font-bold text-gray-800 hover:underline underline-offset-4 cursor-pointer line-clamp-2"
                    title={item?.course_title}
                  >
                    {item?.course_title}
                  </h3>
                </Link>

                <div className="mt-3 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
                  {/* Country */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/location.svg"
                      alt="location"
                      width={16}
                      height={16}
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600 truncate">
                      {item.countryname || "Not specified"}
                    </p>
                  </div>

                  {/* Intake */}
                  <div className="relative group flex items-center gap-2">
                    <Image
                      src="/shop.svg"
                      alt="intake"
                      width={16}
                      height={16}
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600 truncate">
                      {item.intake || "Not specified"}
                    </p>
                    {item.intake && (
                      <div className="hidden group-hover:block absolute top-full left-0 mt-1 z-10 bg-gray-600 text-white text-xs p-2 rounded shadow max-w-xs">
                        {item.intake}
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/clock.svg"
                      alt="duration"
                      width={16}
                      height={16}
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600 truncate">
                      {item.duration || "Not specified"}
                    </p>
                  </div>

                  {/* Fees */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/money.svg"
                      alt="fees"
                      width={16}
                      height={16}
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600 truncate">
                      {item.annual_tuition_fee?.currency &&
                        item.annual_tuition_fee?.amount
                        ? `${item.annual_tuition_fee.currency} ${item.annual_tuition_fee.amount}`
                        : "Contact University"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 mt-auto gap-2">
                <Link
                  // target="_blank"
                  href={`/courses/${item._id}`}
                  // rel="noopener noreferrer"
                  className="w-1/2"
                >
                  <button className="w-full bg-red-500 text-white text-sm p-2 rounded-lg hover:bg-red-600 transition-colors">
                    Course Details
                  </button>
                </Link>

                <div className="w-1/2">
                  <button
                    onClick={() => addToAppliedCourses(item._id)}
                    className="w-full border border-red-500 text-red-500 text-sm p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Create Application
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoriteCourse;
