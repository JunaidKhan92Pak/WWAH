"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRefUserStore } from "@/store/useRefDataStore";
import Image from "next/image";
import { useState } from "react";
// import { useRefUserStore } from "@/store/refUserStore"; // Adjust import path as needed

interface TierInfo {
  name: string;
  image: string;
  minReferrals: number;
  maxReferrals: number;
  nextTier?: string;
}

const Page = () => {
  const { user } = useRefUserStore();
  const [open, setOpen] = useState(false);

  // Get total referrals from user store, default to 0 if not available
  const totalReferrals = user?.totalReferrals || 0;

  // Define tier configurations
  const tierConfigs: TierInfo[] = [
    {
      name: "Starter",
      image: "/refferalportal/referralcontest/Starter.svg",
      minReferrals: 0,
      maxReferrals: 49,
      nextTier: "Bronze",
    },
    {
      name: "Bronze",
      image: "/refferalportal/referralcontest/Bronze.svg",
      minReferrals: 50,
      maxReferrals: 99,
      nextTier: "Silver",
    },
    {
      name: "Silver",
      image: "/refferalportal/referralcontest/Silver.svg",
      minReferrals: 100,
      maxReferrals: 199,
      nextTier: "Gold",
    },
    {
      name: "Gold",
      image: "/refferalportal/referralcontest/Gold.svg",
      minReferrals: 200,
      maxReferrals: 349,
      nextTier: "Platinum",
    },
    {
      name: "Platinum",
      image: "/refferalportal/referralcontest/Platinum.svg",
      minReferrals: 350,
      maxReferrals: 500,
    },
  ];

  // Function to get current tier based on total referrals
  const getCurrentTier = (): TierInfo => {
    for (const tier of tierConfigs) {
      if (
        totalReferrals >= tier.minReferrals &&
        totalReferrals <= tier.maxReferrals
      ) {
        return tier;
      }
    }
    // If more than 500 referrals, return Platinum
    return tierConfigs[4]; // Platinum
  };

  // Function to calculate progress bar values
  const getProgressBarData = () => {
    const currentTier = getCurrentTier();

    let startValue: number;
    let endValue: number;
    let progressPercent: number;

    if (totalReferrals < 50) {
      // Starter tier: 0 to 50
      startValue = 0;
      endValue = 50;
      progressPercent = (totalReferrals / 50) * 100;
    } else if (totalReferrals < 100) {
      // Bronze tier: 50 to 100
      startValue = 50;
      endValue = 100;
      progressPercent = ((totalReferrals - 50) / 50) * 100;
    } else if (totalReferrals < 200) {
      // Silver tier: 100 to 200
      startValue = 100;
      endValue = 200;
      progressPercent = ((totalReferrals - 100) / 100) * 100;
    } else if (totalReferrals < 350) {
      // Gold tier: 200 to 350
      startValue = 200;
      endValue = 350;
      progressPercent = ((totalReferrals - 200) / 150) * 100;
    } else {
      // Platinum tier: 350 to 500+
      startValue = 350;
      endValue = 500;
      progressPercent =
        totalReferrals >= 500 ? 100 : ((totalReferrals - 350) / 150) * 100;
    }

    return {
      currentTier,
      startValue,
      endValue,
      progressPercent: Math.min(progressPercent, 100),
      nextTierName: currentTier.nextTier || "Max Level",
    };
  };

  const progressData = getProgressBarData();

  const tiers = [
    {
      img: "/refferalportal/referralcontest/Starter.svg",
      title: "Starter",
      referrals: "50 Approved Referrals",
      desc: [
        {
          text: "You are just 50 referrals away from Bronze and your First reward!",
          icon: "/refferalportal/referralcontest/checked-tick.svg",
        },
      ],
    },
    {
      img: "/refferalportal/referralcontest/Bronze.svg",
      title: "Bronze",
      referrals: "100 Approved Referrals",
      desc: [
        {
          text: "Shoutout on our official Social Media Pages",
          icon: "/refferalportal/referralcontest/hashtag.svg",
        },
        {
          text: "Pack of exclusive WWAH Goodies",
          icon: "/refferalportal/referralcontest/gift.svg",
        },
      ],
    },
    {
      img: "/refferalportal/referralcontest/Silver.svg",
      title: "Silver",
      referrals: "200 Approved Referrals",
      desc: [
        {
          text: "All Bronze rewards",
          icon: "/refferalportal/referralcontest/checked-tick.svg",
        },
        {
          text: "Internship Opportunity at our company",
          icon: "/refferalportal/referralcontest/job.svg",
        },
      ],
    },
    {
      img: "/refferalportal/referralcontest/Gold.svg",
      title: "Gold",
      referrals: "350 Approved Referrals",
      desc: [
        {
          text: "All Silver rewards",
          icon: "/refferalportal/referralcontest/checked-tick.svg",
        },
        {
          text: "A certificate of Recognition",
          icon: "/refferalportal/referralcontest/certificate.svg",
        },
      ],
    },
    {
      img: "/refferalportal/referralcontest/Platinum.svg",
      title: "Platinum",
      referrals: "500+ Approved Referrals",
      desc: [
        {
          text: "All Gold rewards",
          icon: "/refferalportal/referralcontest/checked-tick.svg",
        },
        {
          text: "Rs 10,000/- Cash Reward",
          icon: "/refferalportal/referralcontest/award.svg",
        },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div
        className="border rounded-2xl shadow-md px-6 py-5 md:py-7 w-full bg-cover bg-center "
        style={{
          backgroundImage: "url('/refferalportal/referralcontest/Refer.svg')",
        }}
      >
        <div className="flex items-center gap-3 my-2">
          <div className="text-gray-800">
            <h3 className="font-bold leading-tight">
              Refer & Win – June Challenge!
            </h3>
            <p className="text-lg text-gray-500 ">
              Every sign up brings you closer to exciting rewards.
            </p>
            <Button className="mt-4 md:mt-8 md:w-[60%] bg-red-700 hover:bg-red-500 rounded-3xl">
              Climb to Platinum status and earn big.
            </Button>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl shadow-sm p-6 border bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/refferalportal/referralcontest/backgroundimg.svg')",
        }}
      >
        {/* Title */}
        <h5 className="text-center">
          Congratulations! Your Current Status is:
        </h5>

        {/* Dynamic Status Badge */}
        <div className="flex justify-center items-center mt-4 mb-12">
          <Image
            src={progressData.currentTier.image}
            alt={`${progressData.currentTier.name} Medal`}
            width={50}
            height={50}
          />
          <p className="bg-[#FFE4C9] text-red-700 rounded-md px-6 py-1 text-xl">
            {progressData.currentTier.name}
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative md:w-[80%] mx-auto">
          {/* Progress Bar */}
          <div className="w-full h-5 rounded-full overflow-hidden flex">
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{ width: `${progressData.progressPercent}%` }}
            ></div>
            <div className="bg-gray-300 h-full flex-1"></div>
          </div>
          
          {/* Current Points Marker */}
          <div
            className="absolute flex flex-col items-center -top-9 transition-all duration-500"
            style={{
              left: `${progressData.progressPercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-green-500 text-white text-xs w-5 md:w-7 h-5 md:h-7 flex items-center justify-center rounded-full relative">
              {totalReferrals > 500 ? "500+" : totalReferrals}
              <div className="absolute -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
            </div>
          </div>
          {/* Trophy Icon */}
          <Image
            src="/refferalportal/referralcontest/trophy.svg"
            alt="Trophy"
            width={24}
            height={24}
            className="absolute -top-0 transition-all duration-500"
            style={{
              left: `${progressData.progressPercent}%`,
              transform: "translateX(-50%)",
            }}
          />
          {/* Next Tier Points - Only show if not at max level */}
          {totalReferrals < 500 && (
            <div className="absolute flex flex-col items-center -top-9 right-0">
              <div className="bg-green-500 text-white text-xs w-5 md:w-7 h-5 md:h-7 flex items-center justify-center rounded-full relative">
                {progressData.endValue}
                <div className="absolute -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Labels */}
        <div className="flex justify-between mt-2 text-lg font-bold text-black md:w-[80%] mx-auto">
          <span>{progressData.currentTier.name}</span>
          <span>{progressData.nextTierName} </span>
        </div>
      </div>

      {/* Status Board */}
      <div className="rounded-xl shadow-sm p-4 border">
        <h3 className="text-center">Status Board</h3>
        <div className="relative flex justify-start md:justify-center overflow-hidden">
          <div
            className="
              grid grid-flow-col auto-cols-[200px] gap-4 
              overflow-x-auto xl:overflow-x-hidden  
              xl:grid-cols-5 xl:auto-cols-auto    
              hide-scrollbar
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {tiers.map((tier, i) => {
              // Determine if this tier is achieved based on total referrals
              const isAchieved = totalReferrals >= tierConfigs[i].minReferrals;
              const isCurrent = progressData.currentTier.name === tier.title;

              return (
                <div key={i} className="flex flex-col items-center">
                  {/* Card */}
                  <div
                    className={`rounded-2xl border shadow-sm flex flex-col items-center w-full p-4 h-[210px] ${
                      isAchieved || isCurrent
                        ? "bg-gradient-to-b from-[#FFFFFE] to-[#FDEEDF]"
                        : "bg-gradient-to-b from-[#FFFFFE] to-[#FDEEDF] opacity-60"
                    }`}
                  >
                    {/* Image + Title */}
                    <div className="flex items-center gap-2 w-full justify-start">
                      <Image
                        src={tier.img}
                        alt={tier.title}
                        width={20}
                        height={20}
                      />
                      <p className="text-lg font-normal">{tier.title}</p>
                    </div>

                    {/* Red Referrals Tag */}
                    <Button
                      className={`text-white mt-4 py-1 rounded-md text-sm ${
                        isAchieved || isCurrent
                          ? "bg-red-700 hover:bg-red-500"
                          : "bg-gray-400 hover:bg-gray-400"
                      }`}
                    >
                      {tier.referrals}
                    </Button>

                    {/* Description */}
                    {tier.desc?.length > 0 && (
                      <div className="text-xs mt-4 text-start space-y-2">
                        {tier.desc.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Image
                              src={item.icon}
                              alt="icons"
                              width={14}
                              height={14}
                              className="mt-[2px]" // aligns icon with text
                            />
                            <span>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Modal */}
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
          <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
            <Image
              src="/DashboardPage/success.svg"
              alt="Success"
              width={150}
              height={150}
            />
            <DialogHeader>
              <DialogTitle className="text-sm font-normal text-center">
                Your reward request has been submitted successfully. <br />
                We will review your request, and the reward will be delivered
                within 3–5 business days.
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
