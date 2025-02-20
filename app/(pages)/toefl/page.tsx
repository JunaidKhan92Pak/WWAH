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
}

export default function Home() {
  const testTypes: { icon: string; title: string }[] = [
    {
      icon: "/iletscap.png",
      title: "TOEFL IBT",
    },
    {
      icon: "/iletsbook.png",
      title: "TOEFL PBT",
    },
  ];

  const steps: Step[] = [
    {
      icon: "/Shield-User--Streamline-Solar-Broken.png",
      alt: "Calendar Icon",
      text: "1. Create a Pearson TOEFL Account",
    },
    {
      icon: "/Login--Streamline-Solar-Broken.png",
      alt: "Clipboard Icon",
      text: "2. Log into Your Account",
    },
    {
      icon: "/Clipboard-Text--Streamline-Solar-Broken.png",
      alt: "Shield Icon",
      text: "3. Choose the Test Type",
    },
    {
      icon: "/Clipboard-Text--Streamline-Solar-Broken.png",
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
        title="Score High with our Expert TOEFL Preparation"
        buttonText="Register Now"
        backgroundImage="./toefl.png"
      />
      <InfoSection
        title1="What is TOEFL?"
        description1="The TOEFL Exam (Pearson Test of English) is a computer-based English language proficiency test designed to assess non-native English speakers' skills in speaking, writing, reading, and listening. TOEFL scores are widely acceTOEFLd for academic admissions, immigration applications, and sometimes for professional registration in English-speaking countries, such as the UK, Australia, New Zealand, and Canada."
        imageSrc1="/whatIsTOEFL.png"
        imageAlt1="iletsInfo"
        title2="Types of TOEFL Exams!"
        description2="The Pearson Test of English (TOEFL) offers two main types of tests:"
        imageSrc2="/iletsInfoImg2.png"
        imageAlt2="Why IELTS"
        dividerImageSrc="/dividerInfoSection.png"
        testTypes={testTypes}
        testDescription="Each test serves different purposes and is tailored to meet the specific needs of candidates. Understanding the differences between these test types is crucial for selecting the one that aligns with your goals."
      />

      <ComparisonSection
        leftItem={{
          title: "TOEFL IBT",
          description:
            "This test is primarily designed for students aiming to study abroad and is widely accepted by universities, colleges, and governments for student visa applications. It evaluates four essential skills: Speaking, Writing, Reading, and Listening. Entirely computer-based, including a recorded speaking section, the test integrates questions to assess multiple skills simultaneously. With a duration of about three hours, it is scored on a 10-90 scale and provides detailed feedback for each section.",
        }}
        rightItem={{
          title: "TOEFL PBT",
          description:
            "It is similar to TOEFL Academic, it tests Listening, Reading, Writing, and Speaking, but with agreater emphasis on practical communication skills rather than academic contexts. The TOEFL General consists of two main parts: a written paper (which includes listening) and a spoken test. It is available in six levels (A1, A2, B1, B2, C1, C2) aligned with the Common European Framework of Reference (CEFR). Its duration varies depending on the level, generally shorter than the TOEFL Academic.",
        }}
      />

      {/* Exam Structure */}

      <ExamStructure
        textSectionTitle="TOEFL IBT Test Format"
        textSectionDescription={[
          "1. The Reading section lasts 54–72 minutes and includes 3–4 academic passages with 10 questions each, assessing comprehension of written texts.",
          "2. In the Listening section, which takes 41–57 minutes, you’ll encounter 3–4 academic lectures and 2-3 conversations, each followed by questions to test understanding of spoken English in an academic context.",
          "3. The Speaking section is 17 minutes long and includes four tasks, where you’ll express opinions on familiar topics and respond to reading and listening prompts. Read more...",
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
          "2. The Structure and Written Expression section, lasting 25 minutes, has 40 questions focusing on English grammar and sentence structure",
          "3. The Reading Comprehension section is 55 minutes long with 50 questions based on academic passages, measuring vocabulary and understanding of complex texts. Read more..",
          "Click here to Register for TOEFL classes with us!",
        ]}
        examSectionTitle="TOEFL Exam Structure!"
        examSectionDescription1="The total duration of the TOEFL IBT Exam is approximately 2 hours."
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
            question: "What is the passing score for TOEFL Academic?",
            answer:
              "The TOEFL test consists of four modules: Listening, Reading, Writing, and Speaking.",
          },
          {
            question: "When are TOEFL results available?",
            answer:
              "Focus on listening carefully to the instructions and key words. Practice active listening skills, and familiarize yourself with different accents. Time management is crucial.",
          },
          {
            question: "What ID is required on test day?",
            answer:
              "The Reading section includes three reading passages, each with a set of questions. It is designed to test your reading skills and understanding of texts, which range from factual to descriptive.",
          },
          {
            question:
              "Is there a limit to how many times I can take the TOEFL Academic?",
            answer:
              "Read the questions first to understand what to look for. Skim the passages for the main ideas, and then scan for specific information. Manage your time wisely, as the section is time-limited.",
          },
          {
            question: "Can I reschedule or cancel my TOEFL test?",
            answer:
              "The TOEFL Writing section consists of two tasks: Task 1 requires you to describe or summarize information from a graph, chart, or diagram. Task 2 requires you to write an essay in response to a question or argument.",
          },
        ]}
      />
    </main>
  );
}
