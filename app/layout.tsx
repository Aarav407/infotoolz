import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategorySidebarServer } from "@/components/CategorySidebarServer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { company } from "@/data/company";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} — IT Hardware Reseller`,
    template: `%s | ${company.name}`,
  },
  description:
    "Browse our complete catalog of IT hardware — processors, GPUs, laptops, storage, monitors, and more. Authorized reseller of genuine products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans antialiased">
        <Header />
        <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
          <CategorySidebarServer />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
