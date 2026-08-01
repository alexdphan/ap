import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 text-body">
      <p style={{ color: "var(--text-primary)" }}>Page not found.</p>
      <Link
        href="/"
        className="inline-block underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        Return home
      </Link>
    </div>
  );
}
