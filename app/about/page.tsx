import type { Metadata } from "next";

import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Alex Phan: angel investing, growth advising, and prior growth engineering work at Rho and Browserbase.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <InfoPage
      title="About"
      intro="A concise, current reference for Alex Phan's background and focus."
      sections={[
        {
          heading: "What I do",
          content: (
            <>
              <p>
                I angel invest and advise startups on growth. I am most drawn
                to opportunities that are elegantly simple yet overlooked,
                especially when clear product thinking and thoughtful
                distribution can create durable momentum.
              </p>
              <p>
                My work sits around founders, products, and the systems that
                help useful ideas reach the right people. The useful starting
                point is usually a specific customer, product, or distribution
                question rather than a broad request for general advice.
              </p>
            </>
          ),
        },
        {
          heading: "Background",
          content: (
            <>
              <p>
                I previously worked as a growth engineer at Rho and
                Browserbase. Those roles combined engineering, product, and
                go-to-market work: building software, explaining it clearly,
                and finding practical ways for the right users to discover it.
              </p>
              <p>
                I am based in New York City and spend time in San Francisco.
                This website is the canonical source for my short biography,
                selected work, public profiles, and current contact routes.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
