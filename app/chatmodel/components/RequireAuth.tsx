// components/SigninRequiredMessage.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Message as MessageType } from "@/lib/types";

interface SigninRequiredMessageProps {
  currentMessages: MessageType[]; // Accept messages as props
}

export const SigninRequiredMessage = ({
  currentMessages,
}: SigninRequiredMessageProps) => {
  const router = useRouter();

  const redirectToSignin = () => {
    // Save current conversation before redirecting
    if (currentMessages.length > 0) {
      localStorage.setItem(
        "pendingConversation",
        JSON.stringify(currentMessages)
      );
      console.log(
        "💾 Saved conversation before signin:",
        currentMessages.length,
        "messages"
      );
    }
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
  };

  const redirectToSignup = () => {
    // Save current conversation before redirecting
    if (currentMessages.length > 0) {
      localStorage.setItem(
        "pendingConversation",
        JSON.stringify(currentMessages)
      );
      console.log(
        "💾 Saved conversation before signup:",
        currentMessages.length,
        "messages"
      );
    }
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/signup?callbackUrl=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="flex gap-5 justify-start items-start max-w-full">
      <div className="flex flex-col items-center gap-2 mb-3 flex-shrink-0">
        <Image src="/zeus_face.png" width={32} height={32} alt="Zeus Avatar" />
        <p className="font-bold text-gray-800 italic text-sm">ZEUS</p>
      </div>
      <Card className="px-4 py-3 bg-white text-black flex-1 max-w-[calc(100%-80px)]">
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-3">
              🔒 <strong>Sign In Required</strong>
            </p>
            <p className="text-gray-600 mb-4">
              You&apos;ve reached the limit for guest chatting. To continue our
              conversation and get personalized recommendations, please sign in
              to your account.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ✅ Your conversation ({currentMessages.length} messages) will
              continue where you left off after signing in
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={redirectToSignin}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
            >
              Sign In to Continue
            </Button>
            <Button
              onClick={redirectToSignup}
              variant="outline"
              className="px-4 py-2 rounded-lg border-red-700 text-red-700 hover:bg-red-50"
            >
              Create Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
