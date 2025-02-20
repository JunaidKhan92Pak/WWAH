"use client";
import Image from "next/image";
import Hero from "@/components/ui/enrollment/Hero";
import InfoSection from "@/components/ui/enrollment/InfoSection";
import ComparisonSection from "@/components/ui/enrollment/Comparison";
import ExamStructure from "@/components/ui/enrollment/ExamStructure";
import OnlineOffline from "@/components/ui/enrollment/OnlineOffline";
import FAQ from "@/components/ui/enrollment/FAQ";
import Registration from "@/components/ui/enrollment/Registration";
import Banner from "@/components/ui/enrollment/Banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// import girl from "@/public/girl.png"

interface Step {
  icon: string;
  alt: string;
  text: string;
}

export default function Home() {
  const testTypes: { icon: string; title: string }[] = [
    {
      icon: "/ilets/iletscap.svg",
      title: "IELTS Academic",
    },
    {
      icon: "/ilets/iletsbook.svg",
      title: "IELTS General Training",
    },
  ];
  const data = {
    title: 'IELTS "Online or Offline"',
    description:
      "The IELTS exam is available in both online (computer-delivered) and offline (paper-based) formats. Each format has its own characteristics, and candidates can choose the one that best suits their preferences and needs. Here are the main differences and similarities between IELTS online and offline:",
  };
  const steps: Step[] = [
    {
      icon: "/Calendar-Search.png",
      alt: "Calendar Icon",
      text: "1. Find a Test Location and Date",
    },
    {
      icon: "/Clipboard.png",
      alt: "Clipboard Icon",
      text: "2. Register Online",
    },
    {
      icon: "/Shield-User.png",
      alt: "Shield Icon",
      text: "3. Create an Account",
    },
    {
      icon: "/Clipboard.png",
      alt: "Clipboard Icon",
      text: "4. Complete the Application Form",
    },
    { icon: "/Dollar.png", alt: "Dollar Icon", text: "5. Pay the Test Fee" },
    { icon: "/Archive.png", alt: "Archive Icon", text: "6. Confirmation" },
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
        title="Score High with our Expert IELTS Preparation"
        buttonText="Register Now"
        backgroundImage="./ielts.png"
      />
      <InfoSection
        title1="What is IELTS?"
        description1="IELTS stands for the International English Language Testing System an English Language proficiency test. The International English Language Testing System (IELTS) is a globally recognized test that assesses the English language proficiency of individuals who wish to study or work in environments where English is the primary language."
        imageSrc1="/ilets/iletsInfoImg1.svg"
        imageAlt1="iletsInfo"
        title2="Why IELTS?"
        description2="The International English Language Testing System (IELTS) is one of the most trusted English proficiency tests in the world."
        imageSrc2="/ilets/iletsInfoImg2.svg"
        imageAlt2="Why IELTS"
        dividerImageSrc="/dividerInfoSection.png"
        testTypes={testTypes}
        testDescription="Each test serves different purposes and is tailored to meet the specific needs of candidates. Understanding the differences between these test types is crucial for selecting the one that aligns with your goals."
      />

      <ComparisonSection
        leftItem={{
          title: "IELTS Academic",
          description:
            "Designed for individuals applying for higher education or professional registration in an English-speaking environment. It assesses whether a candidate is ready to begin studying or training in English at an undergraduate or postgraduate level.",
        }}
        rightItem={{
          title: "IELTS General",
          description:
            "Intended for those planning to migrate to English-speaking countries (such as Australia, Canada, New Zealand, or the UK) or for those seeking work experience, secondary education, or training programs. It measures English proficiency in a practical, everyday context.",
        }}
      />

      <ExamStructure
        textSectionTitle="Test Format"
        textSectionDescription={[
          "Both versions of the IELTS include four sections: Listening, Reading, Writing, and Speaking. The Listening and Speaking sections are identical for both versions, while the Reading and Writing sections differ. The main differences in the Reading and Writing sections, reflecting the specific requirements of academic versus general usage of English. The Academic version focuses on readiness for university-level study and professional registration",
          "Click here to Register for IELTS classes with us!",
        ]}
        examSectionTitle="IELTS Exam Structure!"
        examSectionDescription1="Total duration of IELTS exam is 2 Hours 45 Minutes. The IELTS exam comprises four main
        sections:"
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
        examSectionDescription2="Each section evaluates specific language skills and contributes to your overall band score, which ranges from 1 (non-user) to 9 (expert user)."
      />
      <OnlineOffline title={data.title} description={data.description} />

      {/* <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8 justify-center mt-8 items-center text-center">
        <div className="text-white p-4 sm:p-6 w-[50%] sm:w-[32%]  xl:w-[18%] rounded-lg shadow-lg border-2 border-[#C7161E]">
          <h3 className=" text-[#C7161E]">IELTS Online </h3>
        </div>
        <div className="text-white p-4 sm:p-6 w-[50%] sm:w-[32%]  xl:w-[18%] rounded-lg shadow-lg border-2">
          <h3 className=" text-[#313131]"> IELTS Offline </h3>
        </div>
      </div> */}
   

      {/* IlETS ONLINE OFFLINE SECTION */}
      {/* <section className="parentdiv w-full mx-auto flex justify-center my-6">
        <div className="ChildDiv w-[90%] flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Text Div */}
          {/* <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] p-6 shadow-2xl rounded-3xl flex flex-col">
            <div className="w-full flex flex-col">
              <h3 className="text-[#313131] w-full">
                IELTS Online (Computer-Delivered):
              </h3>
              <p className="mt-2 lg:mt-6">
                Online IELTS is conducted on a computer at an official IELTS
                test center. It typically offers more frequent test dates and
                greater flexibility in choosing test times. Results are usually
                available faster, within 3-5 days. It is ideal for candidates
                who prefer typing over handwriting.
              </p>
            </div>
          </div> */}

          {/* Image Div */}
          {/* <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] relative shadow-2xl rounded-3xl overflow-hidden">
            <Image
              src="/girl.png"
              alt="Image representing IELTS"
              width={500}
              height={20}
              className="rounded-3xl w-full h-full object-cover"
            />
          </div>
        </div> */}
      {/* </section>  */}

      <div className="flex justify-center mt-10">
      <Tabs defaultValue="online" className="flex flex-col items-center ">
        <TabsList className="flex space-x-4 bg-transparent">
          {/* IELTS Online Tab */}
          <TabsTrigger
            value="online"
            className="text-base sm:text-xl relative border bg-transparent rounded-lg px-3 sm:px-12 py-4  focus:outline-none focus:ring-2  focus:ring-red-300 data-[state=active]:bg-red-100"
          >
            IELTS Online
        
          </TabsTrigger>

          {/* IELTS Offline Tab */}
          <TabsTrigger
            value="offline"
            className="text-base sm:text-xl border border-gray-300 rounded-lg px-3 sm:px-12 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 data-[state=active]:bg-red-100"
          >
            IELTS Offline
          </TabsTrigger>
        </TabsList>

        {/* IELTS Online Content */}
        <TabsContent value="online" className="w-full flex justify-center mt-6">
          <section className="parentdiv w-[90%] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Text Div */}
            <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] p-6 shadow-2xl rounded-3xl flex flex-col">
              <div className="w-full flex flex-col">
                <h6 className="text-[#313131] w-full">
                  IELTS Online (Computer-Delivered):
                </h6>
                <p className="mt-2 lg:mt-6">
                  Online IELTS is conducted on a computer at an official IELTS
                  test center. It typically offers more frequent test dates and
                  greater flexibility in choosing test times. Results are
                  usually available faster, within 3-5 days. It is ideal for
                  candidates who prefer typing over handwriting.
                </p>
              </div>
            </div>

            {/* Image Div */}
            <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] relative shadow-2xl rounded-3xl overflow-hidden">
              <Image
                src="/girl.png"
                alt="Image representing IELTS"
                width={500}
                height={20}
                className="rounded-3xl w-full h-full object-cover"
              />
            </div>
          </section>
        </TabsContent>

        {/* IELTS Offline Content */}
        <TabsContent value="offline" className="mt-4">
          <p>Content for IELTS Offline</p>
        </TabsContent>
      </Tabs>
      </div>

      {/* Choosing Section */}
      <section className="flex items-center justify-center my-12">
        <div className="text-center w-full sm:w-[80%] md:w-[70%] lg:w-[50%]">
          <h1 className=" font-extrabold text-[#313131]">
            Choosing between online & offline!
          </h1>

          <p className="mt-4  text-[#313131] px-6 sm:px-0 text-justify sm:text-center">
            Candidates should consider their personal preferences, comfort with
            technology, typing versus handwriting skills, and test date
            availability when choosing between the computer-delivered and
            paper-based IELTS formats. Both formats are widely accepted by
            educational institutions and immigration authorities, so the choice
            primarily depends on the candidates convenience and test taking
            style.
          </p>
        </div>
      </section>

      <Banner
        title="If you are aiming for a Top IELTS Score, then Book with us."
        buttonText="IELTS Preparation Classes"
        buttonLink="/form"
        backgroundImage="/bg-usa.png"
      />

      <Registration
        title="How to Register for IELTS Exam:"
        steps={steps}
        feeTitle="IELTS Exam Fee!"
        feeDescription="The IELTS exam fee varies slightly depending on the specific type of test and location. For the standard IELTS Academic and General Training exams, the fee is 
        $280 - $340. It is advisable to check the official IELTS website or contact your local test center for the exact fee in your region."
      />

      <Banner
        title="Need help with IELTS? Enroll in our IELTS class and get the support you need!"
        buttonText="Enroll Now"
        buttonLink="/form"
        backgroundImage="/bg-usa.png"
      />

      <FAQ
        title="Frequently Asked Questions:"
        items={[
          {
            question: "What is the IELTS test format?",
            answer:
              "The IELTS test consists of four modules: Listening, Reading, Writing, and Speaking.",
          },
          {
            question:
              "What are the Tips for Success in Listening Section of IELTS?",
            answer:
              "Focus on listening carefully to the instructions and key words. Practice active listening skills, and familiarize yourself with different accents. Time management is crucial.",
          },
          {
            question: "What is the Structure of IELTS Reading Section?",
            answer:
              "The IELTS Reading section includes three reading passages, each with a set of questions. It is designed to test your reading skills and understanding of texts, which range from factual to descriptive.",
          },
          {
            question:
              "What are the Tips for Success in Reading Section of IELTS?",
            answer:
              "Read the questions first to understand what to look for. Skim the passages for the main ideas, and then scan for specific information. Manage your time wisely, as the section is time-limited.",
          },
          {
            question: "What is the Structure of IELTS Writing Section?",
            answer:
              "The IELTS Writing section consists of two tasks: Task 1 requires you to describe or summarize information from a graph, chart, or diagram. Task 2 requires you to write an essay in response to a question or argument.",
          },
          {
            question:
              "What are the Tips for Success in Writing Section of IELTS?",
            answer:
              "For Task 1, focus on summarizing the main points, and for Task 2, ensure you present clear arguments with supporting evidence. Practice writing essays and managing your time during the test.",
          },
          {
            question: "What is the Structure of IELTS Speaking Section?",
            answer:
              "The IELTS Speaking section is a face-to-face interview with an examiner. It is divided into three parts: an introduction, a long-turn task where the candidate speaks on a topic, and a discussion on abstract topics.",
          },
          {
            question:
              "What are the Tips for Success in IELTS Speaking Section?",
            answer:
              "Speak clearly and confidently. Practice speaking with fluency and coherence. Answer questions in detail and expand on your ideas. Practice mock interviews with a partner or tutor.",
          },
          {
            question:
              "What are the Tips for Success in IELTS Speaking Section?",
            answer:
              "Speak clearly and confidently. Practice speaking with fluency and coherence. Answer questions in detail and expand on your ideas. Practice mock interviews with a partner or tutor.",
          },
          {
            question: "What are the Eligibility Requirements of IELTS?",
            answer:
              "There are no specific eligibility requirements for IELTS. However, it is typically required for those planning to study or work in an English-speaking country. It is available to individuals 16 years and older.",
          },
          {
            question: "Explain IELTS Band Scores?",
            answer:
              "The IELTS Band Scores range from 0 to 9, with 9 being the highest level of proficiency. Each section of the test (Listening, Reading, Writing, and Speaking) is scored, and the overall band score is the average of these scores.",
          },
          {
            question: "What is the Overall IELTS Band Score?",
            answer:
              "The overall IELTS band score is calculated by averaging the four individual section scores. If the average score ends in .25, it is rounded up, while scores ending in .75 are rounded down.",
          },
          {
            question: "How long is an IELTS score valid?",
            answer:
              "IELTS scores are valid for two years. After that, the scores may no longer reflect your current level of English proficiency, so you might need to retake the exam if your score expires.",
          },
        ]}
      />
    </main>
  );
}
