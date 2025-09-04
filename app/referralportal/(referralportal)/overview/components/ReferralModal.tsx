"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Share,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
  Mail,
  Download,
  Eye,
  // X,
} from "lucide-react";
import QRCodeGen from "qrcode-generator";
import { useRefUserStore } from "@/store/useRefDataStore";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const socialIcons = [
  { icon: Facebook, label: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
  { icon: Linkedin, label: "LinkedIn", color: "bg-blue-800 hover:bg-blue-900" },
  {
    icon: Instagram,
    label: "Instagram",
    color: "bg-pink-600 hover:bg-pink-700",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    color: "bg-green-600 hover:bg-green-700",
  },
  { icon: Mail, label: "Email", color: "bg-gray-600 hover:bg-gray-700" },
];

// Social sharing functions
const handleSocialShare = (
  platform: string,
  referralLink: string,
  referralCode: string
) => {
  const shareText = `Join me on WWAH! Use my referral code ${referralCode} and get exclusive benefits. Sign up here: ${referralLink}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(referralLink);

  let shareUrl = "";

  switch (platform) {
    case "Facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      break;
    case "LinkedIn":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
      break;
    case "WhatsApp":
      shareUrl = `https://wa.me/?text=${encodedText}`;
      break;
    case "Email":
      shareUrl = `mailto:?subject=Join me on WWAH!&body=${encodedText}`;
      break;
    case "Instagram":
      navigator.clipboard.writeText(shareText);
      alert(
        "Referral message copied to clipboard! You can paste it in your Instagram post or story."
      );
      return;
    default:
      return;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
};

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState("");
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const user = useRefUserStore((state) => state.user);

  useEffect(() => {
    if (isOpen && !referralCode) {
      const code = user?.referralCode ?? "";
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${code}`;
      setReferralCode(code);
      setReferralLink(link);

      // Generate QR Code
      const qr = QRCodeGen(0, "L");
      qr.addData(link);
      qr.make();
      setQrCodeSvg(qr.createSvgTag(4, 0));
    }
  }, [isOpen, referralCode, user?.referralCode]);

  const handleCopy = (type: string) => {
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleNativeCopy = async (type: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      handleCopy(type);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const downloadQRCode = () => {
    const svgElement = document.querySelector("#qr-code svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          // Set white background
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `referral-qr-${referralCode}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-lg md:w-full mx-auto bg-white rounded-3xl p-0 border-0 shadow-2xl">
          <div className="relative p-6 md:p-8">
            <div className="space-y-6">
              {/* Referral Code Section */}
              <Card className="bg-orange-50 border-0">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <h3 className="font-medium text-gray-700">
                      Referral Code:
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xl font-bold text-gray-900">
                        {referralCode}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleNativeCopy("code", referralCode)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copied === "code" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleNativeCopy("link", referralLink)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm"
                        >
                          <Share className="h-3 w-3 mr-1" />
                          {copied === "link" ? "Copied!" : "Share Link"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Link Section */}
              <Card className="bg-gray-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {referralLink}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleNativeCopy("link", referralLink)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 text-sm flex-shrink-0"
                    >
                      {copied === "link" ? "Copied!" : "Copy Link"}
                      <Copy className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share Via Section */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Share Via
                </h3>
                <div className="flex justify-center gap-3">
                  {socialIcons.map((social, index) => (
                    <Button
                      key={index}
                      size="sm"
                      className={`${social.color} text-white rounded-full h-10 w-10 p-0 transition-colors`}
                      onClick={() =>
                        handleSocialShare(
                          social.label,
                          referralLink,
                          referralCode
                        )
                      }
                    >
                      <social.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <div className="space-y-2">
                    <div
                      id="qr-code"
                      className="bg-white p-3 rounded-lg border inline-block"
                      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                    <p className="text-sm text-gray-600 font-medium">QR Code</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 w-full"
                      onClick={handlePreview}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 w-full"
                      onClick={downloadQRCode}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Preview Modal */}
      {showPreview && (
        <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
          <DialogContent className="max-w-md w-full mx-auto bg-white rounded-3xl p-0 border-0 shadow-2xl">
            <div className="relative p-6">
              <div className="absolute top-4 right-4">
                {/* <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button> */}
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  QR Code Preview
                </h3>

                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                    <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Referral Code:{" "}
                    <span className="font-mono font-bold">{referralCode}</span>
                  </p>
                  <p className="text-xs text-gray-500 break-all px-4">
                    {referralLink}
                  </p>
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                    onClick={downloadQRCode}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
