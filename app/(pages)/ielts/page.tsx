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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Step {
  icon: string;
  alt: string;
  text: string;
  link?: string;
}

export default function Home() {
  const testTypes: { icon: string; title: string }[] = [
    {
      icon: "/ielts/iletscap.svg",
      title: "IELTS Academic",
    },
    {
      icon: "/ielts/iletsbook.svg",
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
      icon: "/ielts/Calendar-Search.svg",
      alt: "Calendar Icon",
      text: "1. Find a Test Location and Date",
    },
    {
      icon: "/ielts/Clipboard.svg",
      alt: "Clipboard Icon",
      text: "2. Register Online",
      link: "https://ielts.org/take-a-test/booking-your-test",
    },
    {
      icon: "/ielts/Shield-User.svg",
      alt: "Shield Icon",
      text: "3. Create an Account",
    },
    {
      icon: "/ielts/Clipboard.svg",
      alt: "Clipboard Icon",
      text: "4. Complete the Application Form",
    },
    { icon: "/ielts/Dollar.svg", alt: "Dollar Icon", text: "5. Pay the Test Fee" },
    { icon: "/ielts/Archive.svg", alt: "Archive Icon", text: "6. Confirmation" },
    {
      icon: "/ielts/Display.svg",
      alt: "Display Icon",
      text: "7. Prepare for the Test",
    },
    {
      icon: "/ielts/Confetti.svg",
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
        description1="IELTS stands for the International English Language Testing System – an English Language proficiency test. The International English Language Testing System (IELTS) is a globally recognized test that assesses the English language proficiency of individuals who wish to study or work in environments where English is the primary language."
        imageSrc1="/ielts/iletsInfoImg1.svg"
        imageAlt1="iletsInfo"
        title2="Why IELTS?"
        description2="The International English Language Testing System (IELTS) offers two main types of tests:"
        imageSrc2="/ielts/iletsInfoImg2.svg"
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
          "Both versions of the IELTS include four sections: Listening, Reading, Writing, and Speaking. The Listening and Speaking sections are identical for both versions, while the Reading and Writing sections differ. The main differences in the Reading and Writing sections, reflecting the specific requirements of academic versus general usage of English. The Academic version focuses on readiness for university-level study and professional registration, while the General Training version assesses English proficiency in a broader social and workplace context. The scoring system for both versions is the same, with scores reported on a nine-band scale.",
          "Click here to Register for IELTS Academic or General class with us!",
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
          <TabsContent
            value="online"
            className="w-full flex justify-center mt-6"
          >
            <section className="parentdiv w-[90%] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Text Div */}
              <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] p-6 shadow-2xl rounded-3xl flex flex-col">
                <div className="w-full flex flex-col">
                  <h6 className="text-[#313131] w-full">
                    IELTS Online (Computer-Delivered):
                  </h6>
                  <p className="mt-2 lg:mt-6">
                    Online IELTS Conducted on a computer at an official IELTS
                    test center. It Typically offers more frequent test dates
                    and greater flexibility in choosing test times. Results are
                    usually available faster, within 3-5 days. It is Ideal for
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
            <section className="parentdiv w-[90%] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Text Div */}
              <div className="w-full xl:w-1/2 h-full sm:h-[40vw] lg:h-[30vw] xl:h-[22vw] p-6 shadow-2xl rounded-3xl flex flex-col">
                <div className="w-full flex flex-col">
                  <h6 className="text-[#313131] w-full">
                    IELTS Offline:
                  </h6>
                  <p className="mt-2 lg:mt-6">
                    Paper based IELTS Conducted on paper at an official IELTS
                    test center. It Typically offers fewer test dates compared
                    to the computer-delivered format. It is Suitable for
                    candidates who prefer writing by hand. Results are generally
                    available within 13 days after the test.
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
            primarily depends on the candidates convenience and test- taking
            style. If you are aiming for a Top IELTS Score, then Book IELTS
            Preparation classes with us.
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
        feeDescription="The IELTS exam fee varies slightly depending on the specific type of test and location. For the standard IELTS Academic and General Training exams, the fee is $280 - $340. It is advisable to check the official IELTS website or contact your local test center for the exact fee in your region."
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
            question: "What is the Structure of IELTS Listening Section?",
            answer:
              "The Listening section lasts for 30 minutes and includes four recordings of native English speakers. You'll answer a series of questions based on these recordings.",
          },
          {
            question:
              "What are the Tips for Success in Listening Section of IELTS?",
            answer: [
              "- Practice Active Listening: Regularly listen to English audio resources such as podcasts, news broadcasts, and lectures.",
              "- Note-Taking: Develop shorthand skills to quickly jot down important points.",
              "- Predict Answers: Use the context of the conversation to predict possible answers before listening.",
            ],
          },
          {
            question: "What is the Structure of IELTS Reading Section?",
            answer:
              "The Reading section lasts for 60 minutes and includes 40 questions, designed to test a wide range of reading skills. The test is divided into three sections with increasing difficulty.",
          },
          {
            question:
              "What are the Tips for Success in Reading Section of IELTS?",
            answer: [
              "- Skimming and Scanning: Quickly identify main ideas and specific information.",
              "- Time Management: Allocate time wisely, spending approximately 20 minutes per section.",
              "- Vocabulary Building: Enhance your vocabulary by reading diverse English texts.",
            ],
          },
          {
            question: "What is the Structure of IELTS Writing Section?",
            answer: [
              "The Writing section is 60 minutes long and comprises two tasks:",
              "- Task 1: Describe visual information (graphs, charts, tables) in at least 150 words.",
              "- Task 2: Respond to a point of view or argument in at least 250 words.",
            ],
          },
          {
            question:
              "What are the Tips for Success in Writing Section of IELTS?",
            answer: [
              "- Understand Task Requirements: Ensure you meet the word count and address all parts of the question.",
              "- Structure Your Writing: Use clear paragraphs with a logical flow of ideas.",
              "- Practice Regularly: Write essays and reports on various topics to improve clarity and coherence.",
            ],
          },
          {
            question: "What is the Structure of IELTS Speaking Section?",
            answer: [
              "The Speaking section is a face-to-face interview with an examiner, lasting 11-14 minutes. If you take IELTS on paper, your Speaking test will take place on a different day to the other sections of the test, in a 7-day window before or after the main test day. It is divided into three parts:",
              "- Part 1: General questions about yourself and familiar topics.",
              "- Part 2: A talk based on a given topic, with one minute to prepare.",
              "- Part 3: A discussion on abstract ideas and issues related to the Part 2 topic.",
            ],
          },
          {
            question:
              "What are the Tips for Success in IELTS Speaking Section?",
            answer: [
              "- Practice Speaking: Engage in regular conversations with fluent English speakers.",
              "- Fluency and Coherence: Focus on speaking smoothly and logically.",
              "- Pronunciation and Vocabulary: Work on clear pronunciation and appropriate use of vocabulary.",
            ],
          },
          {
            question: "What are the Eligibility Requirements of IELTS?",
            answer: [
              "Age: While there is no age limit, the IELTS test is generally recommended for individuals aged 16 and above.",
              "Identification Requirements:",
              "- Valid ID",
              "- Passport",
              "- National Identity Card",
            ],
          },
          {
            question: "Explain IELTS Band Scores?",
            answer: [
              "The IELTS exam scores candidates on a scale from 1 to 9 for each of the four sections: Listening, Reading, Writing, and Speaking.",
              "Each section of the IELTS test is scored individually on a band scale of 1 to 9, with each band corresponding to a specific level of English proficiency:",
              "- Band 9: Expert User",
              "- Band 8: Very Good User",
              "- Band 7: Good User",
              "- Band 6: Competent User",
              "- Band 5: Modest User",
              "- Band 4: Limited User",
              "- Band 3: Extremely Limited User",
              "- Band 2: Intermittent User",
              "- Band 1: Non-User",
              "- Band 0: Did Not Attempt the Test",
            ],
          },
          {
            question: "What is the Overall IELTS Band Score?",
            answer: [
              "The overall band score is the average of the four individual section band scores, rounded to the nearest whole or half band.",
              "For example: If a candidate scores 6.5 in Listening, 6.0 in Reading, 7.0 in Writing, and 6.5 in Speaking, the overall band score would be:",
              "(6.5 + 6.0 + 7.0 + 6.5) / 4 = 6.5.",
            ],
          },
          {
            question: "How long is an IELTS score valid?",
            answer: "IELTS scores are valid for two years from the test date.",
          },
        ]}
      />
    </main>
  );
}
