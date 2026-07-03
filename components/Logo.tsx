import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  showTagline?: boolean;
  linked?: boolean;
}

export function Logo({
  variant = "full",
  className = "",
  showTagline = false,
  linked = true,
}: LogoProps) {
  if (variant === "icon") {
    return (
      <Image
        src={company.logoIcon}
        alt={company.name}
        width={40}
        height={32}
        className={className}
        priority
      />
    );
  }

  const content = (
    <>
      <Image
        src={company.logo}
        alt={company.name}
        width={160}
        height={48}
        className="h-10 w-auto"
        priority
      />
      {showTagline && (
        <span className="hidden sm:block text-xs text-slate-500 leading-none">
          {company.tagline}
        </span>
      )}
    </>
  );

  if (!linked) {
    return <div className={`flex items-center gap-3 shrink-0 ${className}`}>{content}</div>;
  }

  return (
    <Link href="/" className={`flex items-center gap-3 shrink-0 ${className}`}>
      {content}
    </Link>
  );
}
