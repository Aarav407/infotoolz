import { SectionHeader } from "@/components/Sections";
import { BadgeCheck, Users, Building2, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about InfoToolz — your trusted IT hardware reseller.",
};

const stats = [
  { value: "500+", label: "Products Listed" },
  { value: "50+", label: "Brand Partners" },
  { value: "1000+", label: "Happy Clients" },
  { value: "Pan-India", label: "Delivery Network" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeader
        title="About InfoToolz"
        subtitle="Your trusted partner for genuine IT hardware"
      />

      <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
        <div>
          <p className="text-slate-600 leading-relaxed mb-4">
            InfoToolz is a leading IT hardware reseller specializing in computer
            components, laptops, peripherals, and networking equipment. We partner
            with top global brands to bring you genuine products at competitive prices.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Whether you are building a gaming PC, upgrading office workstations,
            or sourcing hardware for your business, we have the products and expertise
            to help you find exactly what you need.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We deal exclusively in new, genuine products — no refurbished or
            duplicate items. Our team of IT specialists is always ready to assist
            with product selection and technical guidance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-6 text-center"
            >
              <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: BadgeCheck,
            title: "Genuine Products",
            desc: "100% authentic hardware from authorized brand partners.",
          },
          {
            icon: Users,
            title: "Expert Team",
            desc: "IT specialists to guide your purchase decisions.",
          },
          {
            icon: Building2,
            title: "B2B & B2C",
            desc: "Serving individual buyers and enterprise clients alike.",
          },
          {
            icon: Globe,
            title: "Wide Range",
            desc: "Processors to peripherals — everything under one roof.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
