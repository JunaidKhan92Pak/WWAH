"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ImageWithLoader from "@/components/ImageWithLoader";
import { SkeletonCard } from "@/components/skeleton";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";

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

const FavoriteCoursesPage = () => {
  const [favorites, setFavorites] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { user } = useUserStore();

  // Remove favorite without auth token
  const removeFavorite = async (courseId: string) => {
    setRemovingId(courseId);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          action: "remove",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFavorites((prev) =>
          prev.filter((course) => course._id !== courseId)
        );
        toast.success("Course removed from favorites!");
      } else {
        toast.error(data.message || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Something went wrong. Please try again.");
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
          console.log("No user found");
          setFavorites([]);
          return;
        }

        const favoriteIds = (user?.favouriteCourse || []) as string[];
        console.log("User favorite course IDs:", favoriteIds);

        if (favoriteIds.length === 0) {
          console.log("No favorite courses found for user");
          setFavorites([]);
          return;
        }

        // Validate that all IDs are valid strings
        const validIds = favoriteIds.filter(
          (id) => id && typeof id === "string" && id.trim().length > 0
        );

        if (validIds.length === 0) {
          console.log("No valid favorite course IDs found");
          setFavorites([]);
          return;
        }

        // Convert array of IDs to comma-separated string
        const idsString = validIds.join(",");
        console.log("Fetching courses with IDs:", idsString);

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
        console.log("API Response:", data);

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
  }, [user]); // Add user as dependency

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
            href="/courses"
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
                  target="_blank"
                  href={`/courses/${item._id}`}
                  rel="noopener noreferrer"
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

                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-white to-transparent opacity-100 w-[200%] pr-8">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          item.universityData?.universityImages?.logo ||
                          "/logo.png"
                        }
                        alt="university logo"
                        className="w-14 h-14 object-cover object-center rounded-full aspect-square"
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
                  <button
                    onClick={() => removeFavorite(item._id)}
                    disabled={removingId === item._id}
                    className={`transition-opacity ${
                      removingId === item._id
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
                  target="_blank"
                  href={`/courses/${item._id}`}
                  rel="noopener noreferrer"
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
                  target="_blank"
                  href={`/courses/${item._id}`}
                  rel="noopener noreferrer"
                  className="w-1/2"
                >
                  <button className="w-full bg-red-500 text-white text-sm p-2 rounded-lg hover:bg-red-600 transition-colors">
                    Course Details
                  </button>
                </Link>

                <Link href="/dashboard" className="w-1/2">
                  <button className="w-full border border-red-500 text-red-500 text-sm p-2 rounded-lg hover:bg-red-50 transition-colors">
                    Create Application
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoriteCoursesPage;
