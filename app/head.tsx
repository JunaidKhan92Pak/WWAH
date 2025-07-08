// app/head.tsx
export default function Head() {
  return (
    <>
      <title>World Wide Admission Hub</title>
      <meta
        name="description"
        content="Your study abroad journey, simplified with AI"
      />

      {/* Open Graph (for Facebook, WhatsApp) */}
      <meta property="og:title" content="World Wide Admission Hub" />
      <meta
        property="og:description"
        content="Your study abroad journey, simplified with AI"
      />
      <meta property="og:url" content="https://www.wwah.ai/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.wwah.ai/WWAHlogo.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="World Wide Admission Hub" />
      <meta
        name="twitter:description"
        content="Your study abroad journey, simplified with AI"
      />
      <meta name="twitter:image" content="https://www.wwah.ai/WWAHlogo.png" />
    </>
  );
}
