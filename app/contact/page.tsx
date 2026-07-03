import { SectionHeader } from "@/components/Sections";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { company } from "@/data/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${company.name} for product inquiries, bulk orders, and support.`,
};

export default function ContactPage() {
  return (
    <div className="px-4 py-8">
      <SectionHeader
        title="Contact Us"
        subtitle="Reach out for product inquiries, quotes, or bulk orders"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            {
              icon: Phone,
              title: "Phone",
              content: company.phoneDisplay,
              href: `tel:+${company.phone}`,
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              content: company.whatsappDisplay,
              href: company.whatsappUrl,
              external: true,
            },
            {
              icon: Mail,
              title: "Email",
              content: company.email,
              href: `mailto:${company.email}`,
            },
            {
              icon: Clock,
              title: "Business Hours",
              content: "Mon – Sat: 10:00 AM – 7:00 PM",
            },
          ].map(({ icon: Icon, title, content, href, external }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00AFB9]/10 text-[#00AFB9]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                {href ? (
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-slate-600 hover:text-[#00AFB9] transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <p className="text-slate-600">{content}</p>
                )}
              </div>
            </div>
          ))}

          <a
            href={company.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] px-6 py-4 text-white font-semibold hover:bg-[#20BD5A] transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Send an Inquiry
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Tell us what you need and our team will get back to you via email or WhatsApp.
          </p>

          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder={company.email}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Product inquiry / Bulk order / etc."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us about the products you need..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#00AFB9] py-3 text-sm font-semibold text-white hover:bg-[#009AA3] transition-colors"
            >
              Send Inquiry
            </button>

            <p className="text-xs text-slate-400 text-center">
              Or reach us directly on{" "}
              <a href={company.whatsappUrl} className="text-[#25D366] hover:underline">
                WhatsApp
              </a>{" "}
              or email{" "}
              <a href={`mailto:${company.email}`} className="text-[#00AFB9] hover:underline">
                {company.email}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
