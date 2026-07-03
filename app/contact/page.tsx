import { SectionHeader } from "@/components/Sections";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with InfoToolz for product inquiries, bulk orders, and support.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
              content: "+91 98765 43210",
              href: "tel:+919876543210",
            },
            {
              icon: Mail,
              title: "Email",
              content: "info@infotoolz.com",
              href: "mailto:info@infotoolz.com",
            },
            {
              icon: MapPin,
              title: "Address",
              content: "123 Tech Park, Business District, India",
            },
            {
              icon: Clock,
              title: "Business Hours",
              content: "Mon – Sat: 10:00 AM – 7:00 PM",
            },
          ].map(({ icon: Icon, title, content, href }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                {href ? (
                  <a
                    href={href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <p className="text-slate-600">{content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Send an Inquiry
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Tell us what you need and our team will get back to you.
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
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Send Inquiry
            </button>

            <p className="text-xs text-slate-400 text-center">
              This is a display-only site. Form submission will be connected in a future update.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
