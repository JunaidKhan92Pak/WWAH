"use client";
import Hero from "@/components/ui/enrollment/Hero";
import InfoSection from "@/components/ui/enrollment/InfoSection";
import ComparisonSection from "@/components/ui/enrollment/Comparison";
import ExamStructure from "@/components/ui/enrollment/ExamStructure";
import OnlineOffline from "@/components/ui/enrollment/OnlineOffline";
import FAQ from "@/components/ui/enrollment/FAQ";
import Registration from "@/components/ui/enrollment/Registration";
import Banner from "@/components/ui/enrollment/Banner";

interface Step {
  icon: string;
  alt: string;
  text: string;
}

export default function Home() {
  const testTypes: { icon: string; title: string }[] = [
    {
      icon: "/ilets/iletscap.svg",
      title: "PTE Academic",
    },
    {
      icon: "/ilets/iletsbook.svg",
      title: "PTE General",
    },
  ];
  const data = {
    title: 'PTE "Online or Offline"',
    description:
      "PTE Academic Online is a remote proctored version of the test that can be taken at home, in an office, or any private location with a stable internet connection. It is ideal for test-takers who cannot visit a physical test center or prefer the convenience of taking the exam from their own device. The Offline PTE Academic exam is taken at an official Pearson test center on a computer. It is conducted in a secure environment with a proctor present to monitor the test-taker. Both the online and offline versions of PTE Academic are identical in terms of content, format, and scoring. The main differences lie in the test environment and the proctoring method used. Test-takers should carefully consider their options and choose the format that best suits their needs, location, and preferences.",
  };
  const steps: Step[] = [
    {
      icon: "/Shield-User--Streamline-Solar-Broken.png",
      alt: "Calendar Icon",
      text: "1. Create a Pearson PTE Account",
    },
    {
      icon: "/Login--Streamline-Solar-Broken.png",
      alt: "Clipboard Icon",
      text: "2. Log into Your Account",
    },
    {
      icon: "/Clipboard.svg",
      alt: "Shield Icon",
      text: "3. Choose the Test Type",
    },
    {
      icon: "/Clipboard.svg",
      alt: "Clipboard Icon",
      text: "4. Select Your Test Center and Date",
    },
    {
      icon: "/Archive.png",
      alt: "Dollar Icon",
      text: "5. Review and Confirm Details",
    },
    { icon: "/Dollar.png", alt: "Archive Icon", text: "6. Make Payment" },
    {
      icon: "/Display.png",
      alt: "Display Icon",
      text: "7. Prepare for the Test",
    },
    {
      icon: "/Confetti.png",
      alt: "Confetti Icon",
      text: "8. Receive Your Results",
    },
  ];

  return (
    <main>
      <Hero
        title="Score High with our Expert PTE Preparation"
        buttonText="Register Now"
        backgroundImage="./pte.png"
      />
      <InfoSection
        title1="What is PTE?"
        description1="The PTE Exam (Pearson Test of English) is a computer-based English language proficiency test designed to assess non-native English speakers' skills in speaking, writing, reading, and
listening. PTE scores are widely accepted for academic admissions, immigration applications, and sometimes for professional registration in English-speaking countries, such as the UK,
Australia, New Zealand, and Canada.
"
        imageSrc1="/pte/whatIsPTE.svg"
        imageAlt1="iletsInfo"
        title2="Types of PTE Exams!"
        description2="The Pearson Test of English (PTE) offers two main types of tests:"
        imageSrc2="/pte/iletsInfoImg2.svg"
        imageAlt2="Why PTE"
        dividerImageSrc="/dividerInfoSection.png"
        testTypes={testTypes}
        testDescription="Each test serves different purposes and is tailored to meet the specific needs of candidates.
Understanding the differences between these test types is crucial for selecting the one that aligns with your goals.
"
      />

      <ComparisonSection
        leftItem={{
          title: "PTE Academic",
          description:
            "It is Primarily designed for students who want to study abroad. It’s widely accepted by universities, colleges, and governments for student visa applications. The test focuses on four key skills — Speaking, Writing, Reading, and Listening. The test is entirely computer-based, including the speaking section, where responses are recorded via a microphone. The questions are integrated, meaning a single question might test multiple skills. Its Duration is approximately 3 hours. It is scored on a scale of 10-90, with detailed feedback provided on each section",
        }}
        rightItem={{
          title: "PTE General",
          description:
            "It is similar to PTE Academic, it tests Listening, Reading, Writing, and Speaking, but with a greater emphasis on practical communication skills rather than academic contexts. The PTE General consists of two main parts: a written paper (which includes listening) and a spoken test. It is available in six levels (A1, A2, B1, B2, C1, C2) aligned with the Common European Framework of Reference (CEFR). Its duration varies depending on the level, generally shorter than the PTE Academic.",
        }}
      />

      <ExamStructure
        textSectionTitle="PTE Academic Test Format"
        textSectionDescription={[
          "Part 1: Speaking & Writing (This part will take between 54-67 minutes to complete).",
          "Part 2: Reading (This part will take around 30 minutes to complete)",
          "Part 3: Listening (This part will take approximately 30 minutes to complete).",
          "Click here to Register for PTE classes with us!",
        ]}
        examSectionTitle="PTE Exam Structure!"
        examSectionDescription1="The total duration of the PTE Exam is approximately 2 hours."
        sections={[
          {
            icon: "Headphones",
            title: "Listening",
          },
          {
            icon: "MessageSquare",
            title: "Speaking",
          },
          {
            icon: "BookOpen",
            title: "Reading",
          },
          {
            icon: "PenTool",
            title: "Writing",
          },
        ]}
        examSectionDescription2="The PTE Exam tests English skills across four sections: Speaking, Writing, Reading, and Listening. PTE Test results are typically available within 48 hours."
      />

      <Banner
        title="If you are aiming for Top PTE scores then Book with us."
        buttonText="PTE Preparation classes"
        buttonLink="/form"
        backgroundImage="/bg-usa.png"
      />

      <OnlineOffline title={data.title} description={data.description} />

      <Registration
        title="How to Register for PTE Exam:"
        steps={steps}
        feeTitle="PTE Exam Fee!"
        feeDescription="The PTE Academic exam fee varies by country, typically ranging from $180 to $220 USD or its equivalent in local currency"
      />

      <Banner
        title="Need help with PTE? Enroll in our PTE Class and get the support you need."
        buttonText="Enroll Now"
        buttonLink="/form"
        backgroundImage="/bg-usa.png"
      />

      <FAQ
        title="Frequently Asked Questions:"
        items={[
          {
            question: "What is the passing score for PTE Academic?",
            answer: [
              "There is no specific passing score for PTE Academic, as required scores vary based on the institution or immigration body’s requirements.",
              "Most universities require scores between 50 and 65, while visa requirements often range from 65 to 79.",
            ],
          },
          {
            question: "When are PTE results available?",
            answer: [
              "PTE Academic results are typically available within 48 hours of completing the exam.",
              "Test-takers receive an email once the scores are ready, and they can view them on the Pearson PTE portal.",
            ],
          },
          {
            question: "What ID is required on test day?",
            answer: [
              "In most countries, a valid passport is the primary identification required.",
              "Make sure it’s current and matches the details used during registration.",
            ],
          },
          {
            question:
              "Is there a limit to how many times I can take the PTE Academic?",
            answer: [
              "No, there’s no limit on the number of times you can take the test.",
              "However, there must be a minimum gap of 5 days between test attempts.",
            ],
          },
          {
            question: "Can I reschedule or cancel my PTE test?",
            answer: [
              "Yes, you can reschedule or cancel your test.",
              "If you reschedule more than 14 days before the test, there’s no additional fee.",
              "However, rescheduling or canceling within 14 days of the test date may incur charges.",
            ],
          },
        ]}
      />
    </main>
  );
}
