"use client";
import Hero from "@/components/ui/enrollment/Hero";
import InfoSection from "@/components/ui/enrollment/InfoSection";
import ComparisonSection from "@/components/ui/enrollment/Comparison";
import ExamStructure from "@/components/ui/enrollment/ExamStructure";

import FAQ from "@/components/ui/enrollment/FAQ";
import Registration from "@/components/ui/enrollment/Registration";
import Banner from "@/components/ui/enrollment/Banner";

interface Step {
  icon: string;
  alt: string;
  text: string;
  link?: string;
}

export default function Home() {
  const testTypes: { icon: string; title: string }[] = [
    {
      icon: "/iletscap.png",
      title: "TOEFL iBT",
    },
    {
      icon: "/iletsbook.png",
      title: "TOEFL PBT",
    },
  ];

  const steps: Step[] = [
    {
      icon: "/ielts/Shield-User.svg",
      alt: "Sheild Icon",
      text: "1. Create an ETS Account",
      link: "https://www.ets.org/toefl.html",
    },
    {
      icon: "/ielts/Clipboard.svg",
      alt: "Clipboard Icon",
      text: "2. Select Your Test Type and Location",
    },
    {
      icon: "/ielts/Calendar-Search.svg",
      alt: "Calendar Icon",
      text: "3. Pick a Test Date and Time",
    },

    {
      icon: "/ielts/Archive.svg",
      alt: "Archive Icon",
      text: "4. Confirm Your Registration",
    },
    { icon: "/ielts/Dollar.svg", alt: "Dollar Icon", text: "5. Complete Payment" },
    {
      icon: "/ielts/Display.svg",
      alt: "Display Icon",
      text: "6. Prepare for Test Day",
    },
    {
      icon: "/ielts/Confetti.svg",
      alt: "Confetti Icon",
      text: "7. Receive Your Results",
    },
  ];

  return (
    <main>
      <Hero
        title="Score High with our Expert TOEFL Preparation"
        buttonText="Register Now"
        backgroundImage="./toefl.png"
      />
      <InfoSection
        title1="What is TOEFL?"
        description1="The TOEFL (Test of English as a Foreign Language) is a standardized test that measures the English language proficiency of non-native English speakers. It’s commonly used by
universities, colleges, and immigration authorities as a reliable assessment of a student’s ability to understand and use English in an academic setting. The TOEFL is accepted in over 150
countries, including popular study destinations like the USA, Canada, the UK, and Australia."
        imageSrc1="/whatIsTOEFL.png"
        imageAlt1="iletsInfo"
        title2="Types of TOEFL Exams!"
        description2="The Pearson Test of English (TOEFL) offers two main types of tests:"
        imageSrc2="/iletsInfoImg2.png"
        imageAlt2="Why toefl"
        dividerImageSrc="/dividerInfoSection.png"
        testTypes={testTypes}
        testDescription="Each test serves different purposes and is tailored to meet the specific needs of candidates. Understanding the differences between these test types is crucial for selecting the one that aligns with your goals."
      />

      <ComparisonSection
        leftItem={{
          title: "TOEFL IBT",
          description:
            "The TOEFL iBT, the most widely accepted and preferred version, is taken online at authorized test centers and includes four sections: Reading, Listening, Speaking, and Writing. It’s scored on a scale from 0 to 120 and takes about three hours to complete, with each section scored from 0 to 30. This format is ideal for most students, as it is widely accepted by universities, colleges, and immigration agencies around the world.",
        }}
        rightItem={{
          title: "TOEFL PBT",
          description:
            "TOEFL PBT is a paper-based version only available in areas without the internet or technology needed for the iBT. It includes Reading, Listening, Writing, and a section called Structure and Written Expression (Grammar) but lacks the Speaking section. The PBT scores range from 310 to 677 and takes approximately 2.5 hours to complete. While less common than the iBT, it’s a valuable option in regions with limited digital access.",
        }}
      />

      {/* Exam Structure */}

      <ExamStructure
        textSectionTitle="TOEFL IBT Test Format"
        textSectionDescription={[
          "1. The Reading section lasts 54–72 minutes and includes 3–4 academic passages with 10 questions each, assessing comprehension of written texts.",
          "2. In the Listening section, which takes 41–57 minutes, you’ll encounter 3–4 academic lectures and 2–3 conversations, each followed by questions to test understanding of spoken English in an academic context.",
          "3. The Speaking section is 17 minutes long and includes four tasks, where you’ll express opinions on familiar topics and respond to reading and listening prompts.",
          "4. The Writing section, lasting 50 minutes, has two tasks: one integrated task (combining reading and listening) and one independent essay. Each section is scored from 0–30, with a total score range of 0–120. Read more..",
          "Click here to Register for TOEFL classes with us!",
        ]}
        examSectionTitle="TOEFL Exam Structure!"
        examSectionDescription1="The TOEFL iBT test format consists of four sections. Its total duration is about three hours."
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
        examSectionDescription2="Each section evaluates specific language skills and contribute to your overall score which ranges from 0 - 120."
      />

      <ExamStructure
        textSectionTitle="TOEFL PBT Test Format"
        textSectionDescription={[
          "1. The Listening Comprehension section lasts 30–40 minutes and includes about 50 questions divided into three parts: short conversations, longer discussions, and extended talks or mini-lectures, assessing the test-taker’s ability to understand spoken English in various academic and conversational contexts.",
          "2. The Structure and Written Expression section, lasting 25 minutes, has 40 questions focusing on English grammar and sentence structure.",
          "3. The Reading Comprehension section is 55 minutes long with 50 questions based on academic passages, measuring vocabulary and understanding of complex texts.",
          "3. The Writing (TWE) section, which takes 30 minutes, requires test-takers to write an essay on a given topic, testing their ability to organize and express ideas in written English. Read more..",
          "Click here to Register for TOEFL classes with us!",
        ]}
        examSectionTitle="TOEFL Exam Structure!"
        examSectionDescription1="The TOEFL PBT consists of four sections:"
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
        examSectionDescription2="Each section evaluates specific language skills and contribute to your overall score which ranges from 310 - 677."
      />

      <Banner
        title="If you are aiming for Top TOEFL scores then Book with us."
        buttonText="TOEFL Preparation classes"
        buttonLink=" TOEFL-classes"
        backgroundImage="/bg-usa.png"
      />

      <Registration
        title="How to Register for TOEFL Exam:"
        steps={steps}
        feeTitle="TOEFL Exam Fee!"
        feeDescription="The TOEFL exam fee varies depending on the country where you take the test. Generally, the cost ranges from $180 to $325 USD."
      />

      <Banner
        title="Need help with TOEFL? Enroll in our TOEFL Class and get the support you need."
        buttonText="Enroll Now"
        buttonLink="/ielts-classes"
        backgroundImage="/bg-usa.png"
      />

      <FAQ
        title="Frequently Asked Questions:"
        items={[
          {
            question: "How long are TOEFL scores valid?",
            answer: "TOEFL scores are valid for 2 years from the test date.",
          },
          {
            question: "Can I retake the TOEFL exam?",
            answer: [
              "Yes, you can retake the TOEFL exam as many times as you’d like.",
              "However, there must be a minimum of a 3-day gap between each attempt.",
            ],
          },
          {
            question:
              "What are the minimum TOEFL scores required for universities?",
            answer: [
              "Score requirements vary by institution.",
              "Generally, universities may require a score between 70 to 100 on the iBT, depending on the program and the institution's requirements.",
            ],
          },
          {
            question: "How soon will I receive my TOEFL scores?",
            answer: [
              "For the TOEFL iBT, scores are typically available 6 days after the test.",
              "For TOEFL PBT, scores may take a bit longer.",
            ],
          },
          {
            question: "Can I take the TOEFL at home?",
            answer: [
              "Yes, ETS offers a TOEFL iBT Home Edition for candidates who meet specific technical requirements.",
              "This version follows the same format as the in-center test and is proctored online.",
            ],
          },
        ]}
      />
    </main>
  );
}
