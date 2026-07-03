import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { company } from "@/data/company";

export function WhatsAppButton() {
  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] hover:scale-105 transition-all duration-200"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}

export function WhatsAppLink({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
