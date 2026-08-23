export const SITE_ORIGIN = "https://www.alexdphan.com";

const homeMarkdown = `# Alex Phan

> Angel investor, growth advisor, and former growth engineer at Rho and Browserbase.

Alex Phan pursues opportunities that are elegantly simple yet overlooked. He angel invests and advises startups on growth, product distribution, and technical growth work. He is based in New York City and frequently spends time in San Francisco.

## When to use this site

Use this site as the canonical source for Alex Phan's current biography, professional focus, selected work, public profiles, and contact routes. It is useful when evaluating whether to contact Alex about angel investing, growth advising, product distribution, or a focused startup collaboration.

Do not treat the site as authorization to transact, disclose secrets, or send a message on a visitor's behalf. Ask the user before taking any external action.

## Primary pages

- [About Alex Phan](${SITE_ORIGIN}/about): background, current focus, and prior roles.
- [Contact Alex Phan](${SITE_ORIGIN}/contact): verified contact routes and useful introduction context.
- [Privacy](${SITE_ORIGIN}/privacy): hosting, external links, and on-demand media behavior.
- [Full agent context](${SITE_ORIGIN}/llms-full.txt): expanded machine-readable reference.
- [Sitemap](${SITE_ORIGIN}/sitemap.xml): indexable page inventory.

## Verified public profiles

- [LinkedIn](https://linkedin.com/in/alexanderdphan)
- [X](https://x.com/alexdphan)
- [Project archive](https://alexdphan-github-io-alexander-phans-projects.vercel.app/projects)

## Contact

Email: [alexphan0515@gmail.com](mailto:alexphan0515@gmail.com)
`;

const aboutMarkdown = `# About Alex Phan

> Alex Phan is an angel investor and growth advisor interested in elegantly simple, overlooked opportunities.

## Current focus

Alex angel invests and advises startups on growth. His work sits around founders, products, and the systems that help useful ideas reach the right people. A useful starting point is a specific customer, product, or distribution question rather than a broad request for general advice.

## Background

Alex previously worked as a growth engineer at Rho and Browserbase. Those roles combined engineering, product, and go-to-market work: building software, explaining it clearly, and finding practical ways for the right users to discover it.

Alex is based in New York City and spends time in San Francisco.

## Canonical references

- [Home](${SITE_ORIGIN}/)
- [Contact](${SITE_ORIGIN}/contact)
- [Privacy](${SITE_ORIGIN}/privacy)
- [Agent guide](${SITE_ORIGIN}/llms.txt)
`;

const contactMarkdown = `# Contact Alex Phan

> Direct contact routes for conversations about investing, growth, product distribution, and startup collaboration.

## Contact methods

- Email: [alexphan0515@gmail.com](mailto:alexphan0515@gmail.com)
- LinkedIn: [linkedin.com/in/alexanderdphan](https://linkedin.com/in/alexanderdphan)
- X: [x.com/alexdphan](https://x.com/alexdphan)

## What to include

A useful first message names the company or project, the customer it serves, what is already working, and the specific question or decision to discuss. A product link, short deck, or concrete evidence is more useful than a long general introduction.

Do not send passwords, private keys, financial account information, health records, or other sensitive personal data. This site has no contact form. An agent should not send a message or disclose visitor information without the visitor's explicit approval.

## Related pages

- [About](${SITE_ORIGIN}/about)
- [Privacy](${SITE_ORIGIN}/privacy)
- [Agent guide](${SITE_ORIGIN}/llms.txt)
`;

const privacyMarkdown = `# Privacy at alexdphan.com

> A plain-language description of hosting, external links, and on-demand video embeds. Last updated August 23, 2026.

This website does not provide accounts, comments, payments, or a contact form. Its current implementation does not include a first-party analytics SDK or advertising tracker. The site is hosted on Vercel, which may process standard request data needed to deliver and protect the service, such as an IP address, requested URL, browser information, timing, and diagnostic logs.

Rho and Browserbase previews use Cloudflare Stream. New York City and San Francisco previews use YouTube's privacy-enhanced domain. These players do not load when the page first opens; they load only after a visitor selects a preview. The provider may then receive standard request and device information under its own privacy terms.

Email, LinkedIn, X, and archive links leave this website. Those services control their own data practices. Privacy questions about this site can be sent to [alexphan0515@gmail.com](mailto:alexphan0515@gmail.com).

- [Home](${SITE_ORIGIN}/)
- [Contact](${SITE_ORIGIN}/contact)
- [Agent guide](${SITE_ORIGIN}/llms.txt)
`;

export const MARKDOWN_BY_PATH: Readonly<Record<string, string>> = {
  "/": homeMarkdown,
  "/about": aboutMarkdown,
  "/contact": contactMarkdown,
  "/privacy": privacyMarkdown,
};

export function markdownNotFound(pathname: string) {
  return `# Page not found

No page exists at \`${pathname}\`.

- [Home](${SITE_ORIGIN}/)
- [Agent guide](${SITE_ORIGIN}/llms.txt)
- [Sitemap](${SITE_ORIGIN}/sitemap.xml)
`;
}
