import type { Metadata } from "next";

import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Alex Phan by email, LinkedIn, or X about investing, growth, product distribution, and startup collaboration.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      intro="The direct ways to reach Alex Phan and the context that makes an introduction useful."
      sections={[
        {
          heading: "Reach out",
          content: (
            <>
              <p>
                Email is the most direct route: {" "}
                <a
                  href="mailto:alexphan0515@gmail.com"
                  className="underline underline-offset-4"
                >
                  alexphan0515@gmail.com
                </a>
                . You can also find me on {" "}
                <a
                  href="https://linkedin.com/in/alexanderdphan"
                  className="underline underline-offset-4"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>{" "}
                and {" "}
                <a
                  href="https://x.com/alexdphan"
                  className="underline underline-offset-4"
                  rel="noopener noreferrer"
                >
                  X
                </a>
                . These are the public profiles linked from this site.
              </p>
              <p>
                Relevant notes can cover angel investing, growth advising,
                product distribution, technical growth work, or a focused
                startup collaboration. I am based in New York City and am
                frequently in San Francisco.
              </p>
            </>
          ),
        },
        {
          heading: "What to include",
          content: (
            <>
              <p>
                A useful first message names the company or project, the
                customer it serves, what is already working, and the specific
                question or decision you want to discuss. Links to a product,
                short deck, or concrete evidence are more useful than a long
                general introduction.
              </p>
              <p>
                Please do not send passwords, private keys, financial account
                information, health records, or other sensitive personal data.
                This site has no contact form and does not ask agents to submit
                information on a visitor&apos;s behalf.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
