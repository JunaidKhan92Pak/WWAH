import React from 'react'
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
const AccountManager = () => {
  return (
    <>
     <Card>
            <div className="bg-red-600 text-white px-4 py-2 text-center font-semibold rounded-t">
              Your Account Manager
            </div>
            <CardContent className="flex flex-col items-center text-center pt-4 space-y-2">
              <Image
                src="/DashboardPage/Objects.svg"
                alt="Object"
                width={60}
                height={60}
                className="rounded-full mx-auto"
              />
              <p className="font-semibold">Fatima Khan</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Image
                  src="/partnersportal/mail.svg"
                  alt="Email Icon"
                  width={16}
                  height={16}
                />
                <p>FatimaKhan063@gmail.com</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Image
                  src="/partnersportal/phone.svg"
                  alt="Phone Icon"
                  width={14}
                  height={14}
                />
                <p>0304 8548402</p>
              </div>
            </CardContent>
          </Card> 
    </>
  )
}

export default AccountManager
