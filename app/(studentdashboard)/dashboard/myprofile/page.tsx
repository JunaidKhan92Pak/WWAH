"use client"
import { useState } from "react";
import HeroSection from './components/HeroSection'
import MyProfileInfo from './components/MyProfileInfo'

const Page = () => {
  const [firstName, setFirstName] = useState("Asma");
  const [lastName, setLastName] = useState("Kazmi");

  return (
    <div>
      <HeroSection firstName={firstName} lastName={lastName} />
      <MyProfileInfo setFirstName={setFirstName} setLastName={setLastName} firstName={firstName} lastName={lastName} />
    </div>
  )
}

export default Page
