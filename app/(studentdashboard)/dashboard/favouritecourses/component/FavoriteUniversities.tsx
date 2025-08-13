"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ImageWithLoader from "@/components/ImageWithLoader";
import { SkeletonCard } from "@/components/skeleton";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import { getAuthToken } from "@/utils/authHelper";

interface University {
  _id: string;
  university_name: string;
  country_name: string;
  university_type: string;
  qs_world_university_ranking: string;
  acceptance_rate: string | number;
  universityImages: {
    banner: string;
    logo: string;
  };
  description?: string;
  established_year?: string | number;
  total_students?: string | number;
  international_students?: string | number;
}

const FavoriteUniversities = () => {
  const [favorites, setFavorites] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { user, fetchUserProfile } = useUserStore();

  // Remove favorite with proper backend integration
  const removeFavorite = async (universityId: string) => {
    setRemovingId(universityId);

    try {
      const token = getAuthToken();

      // Call the backend endpoint for university favorites (adjust endpoint as needed)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}university-favorites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            universityId,
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
          prev.filter((university) => university._id !== universityId)
        );

        // Refresh user profile to sync with backend
        await fetchUserProfile();

        toast.success("University removed from favorites!", {
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
        // Check if user exists and has favorite universities
        if (!user) {
          console.log("No user found");
          setFavorites([]);
          return;
        }

        const favoriteIds = (user?.favouriteUniversity ||
          []) as unknown as string[];
        // console.log("User favorite university IDs:", favoriteIds);

        if (favoriteIds.length === 0) {
          console.log("No favorite universities found for user");
          setFavorites([]);
          return;
        }

        // Validate that all IDs are valid strings
        const validIds = favoriteIds.filter(
          (id) => id && typeof id === "string" && id.trim().length > 0
        );

        if (validIds.length === 0) {
          console.log("No valid favorite university IDs found");
          setFavorites([]);
          return;
        }

        // Convert array of IDs to comma-separated string
        const idsString = validIds.join(",");
        // console.log("Fetching universities with IDs:", idsString);

        const response = await fetch(
          `/api/universities/favourites?ids=${encodeURIComponent(idsString)}`,
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
          setFavorites(data.favouriteUniversities || []);
        } else {
          setError(data.message || "Failed to load favorite universities");
        }
      } catch (error) {
        console.error("Error fetching favorite universities:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load favorite universities. Please try again."
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
        <h1 className="text-2xl font-bold mb-2">My Favorite Universities</h1>
        <p className="text-gray-600">
          {favorites.length} Favourited Universities
        </p>
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
            No favorite universities yet
          </p>
          <p className="text-gray-400 mt-2 mb-4">
            Start exploring universities and add them to your favorites!
          </p>
          <Link
            href="/Universities"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Universities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden p-3"
            >
              <div className="relative h-[200px]">
                <div className="absolute z-10 top-5 left-0 bg-gradient-to-r from-[#FCE7D2] to-[#CEC8C3] px-2 rounded-tr-xl w-1/2">
                  <p className="text-sm font-medium">
                    QS World Ranking:{" "}
                    {item.qs_world_university_ranking
                      ?.toString()
                      .toUpperCase() || "N/A"}
                  </p>
                </div>

                {/* Remove favorite button */}
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

                <ImageWithLoader
                  src={item.universityImages?.banner ?? "/banner.jpg"}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                  className="h-[180px] w-[400px] object-cover rounded-xl"
                  alt={`${item.university_name} Banner`}
                />

                <div className="absolute bottom-1 left-5">
                  <Image
                    unoptimized
                    src={item.universityImages?.logo ?? "/banner.jpg"}
                    width={100}
                    height={90}
                    className="rounded-full bg-white border border-black w-[56px] h-[56px]"
                    alt="University Logo"
                  />
                </div>
              </div>

              <div className="p-2 h-[80px] flex flex-col justify-between">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/Universities/${item._id}`}
                  key={item._id}
                >
                  <p className="font-bold hover:underline underline-offset-2 line-clamp-2">
                    {item.university_name}
                  </p>
                </Link>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">{item.country_name}</p>
                  <p className="text-sm text-gray-600">
                    {item.university_type || "Public"}
                  </p>
                </div>
              </div>

              <hr className="mx-2 my-3" />
              <p className="text-sm font-bold pb-2">Acceptance Rate:</p>
              <div className="relative bg-[#F1F1F1] rounded-md h-7">
                {(() => {
                  const rate = item.acceptance_rate?.toString().trim();
                  let displayRate = rate;
                  let numericWidth = 0;
                  let isValidNumber = true;

                  // Normalize known non-numeric labels like "n/a"
                  if (rate?.toLowerCase() === "n/a") {
                    displayRate = "N/A";
                    isValidNumber = false;
                    numericWidth = 100; // Fallback width
                  } else if (rate?.includes("to")) {
                    const [start, end] = rate
                      .split("to")
                      .map((val: string) => parseFloat(val.trim()));

                    if (isNaN(start) || isNaN(end)) {
                      isValidNumber = false;
                      numericWidth = 100;
                    } else {
                      const avg = ((start + end) / 2).toFixed(1);
                      numericWidth = parseFloat(avg);
                      displayRate = `${start}% - ${end}%`;
                    }
                  } else {
                    numericWidth = parseFloat(rate || "0");
                    if (isNaN(numericWidth)) {
                      isValidNumber = false;
                      numericWidth = 100;
                    }
                  }

                  const bgColor = isValidNumber ? "#16C47F" : "#FFE5B4"; // green or soft yellow

                  return (
                    <div
                      className="text-white flex items-center justify-center h-7 rounded-lg transition-all duration-500"
                      style={{
                        width: `${numericWidth}%`,
                        backgroundColor: bgColor,
                      }}
                    >
                      <p className="text-sm leading-3 px-2 text-black">
                        {displayRate}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoriteUniversities;
