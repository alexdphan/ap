import { type NextRequest, NextResponse } from "next/server";

import {
  MARKDOWN_BY_PATH,
  markdownNotFound,
  SITE_ORIGIN,
} from "@/lib/agent-content";

type MediaRange = {
  type: string;
  subtype: string;
  quality: number;
  index: number;
};

function parseAccept(header: string): MediaRange[] {
  return header
    .split(",")
    .map((entry, index) => {
      const [rawMediaType, ...rawParameters] = entry
        .trim()
        .toLowerCase()
        .split(";");
      const [type, subtype] = rawMediaType.trim().split("/");
      const qualityParameter = rawParameters.find(
        (parameter) => parameter.trim().split("=")[0] === "q"
      );
      const parsedQuality = qualityParameter
        ? Number(qualityParameter.split("=")[1])
        : 1;

      return {
        type,
        subtype,
        quality: Number.isFinite(parsedQuality)
          ? Math.min(1, Math.max(0, parsedQuality))
          : 0,
        index,
      };
    })
    .filter((range) => range.type && range.subtype);
}

function effectiveQuality(
  ranges: MediaRange[],
  type: string,
  subtype: string
) {
  const matches = ranges
    .filter(
      (range) =>
        (range.type === "*" || range.type === type) &&
        (range.subtype === "*" || range.subtype === subtype)
    )
    .map((range) => ({
      ...range,
      specificity:
        range.type === type && range.subtype === subtype
          ? 2
          : range.type === type
            ? 1
            : 0,
    }))
    .sort(
      (left, right) =>
        right.specificity - left.specificity || left.index - right.index
    );

  return matches[0]?.quality ?? 0;
}

function prefersMarkdown(acceptHeader: string | null) {
  if (!acceptHeader) return false;

  const ranges = parseAccept(acceptHeader);
  const markdownQuality = effectiveQuality(ranges, "text", "markdown");
  const htmlQuality = effectiveQuality(ranges, "text", "html");

  if (markdownQuality !== htmlQuality) {
    return markdownQuality > htmlQuality;
  }
  if (markdownQuality === 0) return false;

  const markdownIndex = ranges.findIndex(
    (range) => range.type === "text" && range.subtype === "markdown"
  );
  const htmlIndex = ranges.findIndex(
    (range) => range.type === "text" && range.subtype === "html"
  );

  return markdownIndex !== -1 &&
    (htmlIndex === -1 || markdownIndex < htmlIndex);
}

function addVaryAccept(headers: Headers) {
  const existing = headers.get("Vary")?.split(",") ?? [];
  const values = new Map(
    existing
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => [value.toLowerCase(), value])
  );
  values.set("accept", "Accept");
  headers.set("Vary", Array.from(values.values()).join(", "));
}

function representationLink(pathname: string) {
  return `<${SITE_ORIGIN}${pathname}>; rel="alternate"; type="text/markdown", <${SITE_ORIGIN}/llms.txt>; rel="describedby"; type="text/markdown"`;
}

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const pathname =
    request.nextUrl.pathname.length > 1
      ? request.nextUrl.pathname.replace(/\/$/, "")
      : "/";

  if (prefersMarkdown(request.headers.get("Accept"))) {
    const markdown = MARKDOWN_BY_PATH[pathname];
    const status = markdown ? 200 : 404;
    const body = markdown ?? markdownNotFound(pathname);
    const response = new NextResponse(request.method === "HEAD" ? null : body, {
      status,
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Language": "en",
        "Content-Type": "text/markdown; charset=utf-8; variant=CommonMark",
        Link: representationLink(pathname),
        "X-Content-Type-Options": "nosniff",
      },
    });
    addVaryAccept(response.headers);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Link", representationLink(pathname));
  addVaryAccept(response.headers);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt|.*\\.[^/]+$).*)",
  ],
};
