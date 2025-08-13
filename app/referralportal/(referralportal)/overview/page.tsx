"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import ReferralModal from "./components/ReferralModal";
import totalSignups from "../../../../public/refferalportal/Overview/totalSignups.svg";
import pendingSignups from "../../../../public/refferalportal/Overview/pendingSignups.svg";
import approvedSignups from "../../../../public/refferalportal/Overview/approvedSignups.svg";
import rejectedSignups from "../../../../public/refferalportal/Overview/rejectedSignups.svg";
import profits from "../../../../public/refferalportal/Overview/profits.svg";
import Image from "next/image";
import refer from "../../../../public/refferalportal/Overview/refer.svg";

const statsData = [
  {
    title: "Total Sign-ups",
    value: "11",
    icon: totalSignups,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Pending Sign-ups",
    value: "1",
    icon: pendingSignups,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "Approved Sign-ups",
    value: "1",
    icon: approvedSignups,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Rejected Sign-ups",
    value: "1",
    icon: rejectedSignups,
    bgColor: "bg-gray-50",
    iconColor: "text-gray-600",
  },
  {
    title: "Total Commission Earned",
    value: "1",
    icon: profits,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
];

const referralsData = [
  {
    name: "Fatima Khan",
    initials: "FK",
    status: "Approved",
    date: "June 8",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    name: "Zakria Tariq",
    initials: "ZT",
    status: "Rejected",
    date: "June 7",
    statusColor: "bg-red-100 text-red-800",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function getDarkerBgColor(lightColor: string): string {
    const shadeMap: Record<string, string> = {
      "bg-blue-50": "bg-blue-200",
      "bg-yellow-50": "bg-yellow-200",
      "bg-pink-50": "bg-pink-200",
      "bg-gray-50": "bg-gray-200",
      "bg-green-50": "bg-green-200",
    };
    return shadeMap[lightColor] || lightColor;
  }

  return (
    <div className="min-h-screen p-4 ">
      <div className="mx-auto space-y-8">
        {/* Welcome Section */}
        <Card
          className="shadow-sm overflow-hidden relative"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #FCE7D2 100%)",
          }}
        >
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">👋</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome, ZAKRIA TARIQ!
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Track your performance, rewards and upcoming goals at a glance.
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className={`${stat.bgColor} border-0 shadow-sm  hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4 ">
                <div className="flex items-center justify-between gap-4">
                  {/* Icon */}
                  <Image
                    src={stat.icon}
                    alt="icon"
                    width={5}
                    height={5}
                    className={`h-8 w-8 ${stat.iconColor}`}
                  />

                  {/* Title */}
                  <p className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </p>

                  {/* Value */}
                  <span
                    className={`text-2xl font-bold text-gray-900 px-3 py-1 rounded ${getDarkerBgColor(
                      stat.bgColor
                    )}`}
                  >
                    {stat.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refer & Make Money Section */}
        <Card
          className="shadow-sm overflow-hidden relative"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #FCE7D2 100%)",
          }}
        >
          <CardContent className="p-6 md:p-8 flex items-center justify-between">
            <div className="flex flex-col items-start justify-between gap-6 flex-1">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Refer & Make Money
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-6 lg:mb-0">
                  Help students join WWAH and earn up to 1,000/- per referral.
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base font-medium rounded-full transition-colors"
              >
                Generate your Referral Link
              </Button>
            </div>

            {/* Decorative Element */}
            <div className="flex-shrink-0 hidden md:flex ">
              <Image
                src={refer}
                alt="Refer illustration"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>

        {/* My Referrals Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              My Referrals
            </h3>

            <div className="space-y-4">
              {referralsData.map((referral, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red-600 text-white font-medium">
                        {referral.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className=" font-bold text-gray-900">
                        {referral.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge
                      className={`${referral.statusColor} border-0 font-medium px-3 py-1`}
                    >
                      {referral.status}
                    </Badge>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {referral.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
