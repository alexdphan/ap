import type { Metadata } from "next";

import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy information for alexdphan.com, including hosting, external links, and on-demand third-party video embeds.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy"
      intro="What this small personal website does—and does not—collect. Last updated August 23, 2026."
      sections={[
        {
          heading: "Information on this site",
          content: (
            <>
              <p>
                This website does not provide accounts, comments, payments, or
                a contact form. Its current implementation does not include a
                first-party analytics SDK or advertising tracker. If you email
                Alex or contact him through a linked service, the information
                you provide is handled through that service rather than through
                a form on this website.
              </p>
              <p>
                The site is hosted on Vercel. Like other hosting providers,
                Vercel may process standard request data needed to deliver and
                protect the service, such as an IP address, requested URL,
                browser information, timing, and diagnostic logs.
              </p>
            </>
          ),
        },
        {
          heading: "External media and links",
          content: (
            <>
              <p>
                Rho and Browserbase previews use Cloudflare Stream. New York
                City and San Francisco previews use YouTube&apos;s privacy-enhanced
                domain. These video players are not loaded when the page first
                opens; they load only after a visitor selects the corresponding
                preview. At that point, the video provider may receive standard
                request and device information under its own privacy terms.
              </p>
              <p>
                Links to email, LinkedIn, X, and the project archive leave this
                site. Those services control their own collection and use of
                data. For a privacy question about this website, email {" "}
                <a
                  href="mailto:alexphan0515@gmail.com"
                  className="underline underline-offset-4"
                >
                  alexphan0515@gmail.com
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
