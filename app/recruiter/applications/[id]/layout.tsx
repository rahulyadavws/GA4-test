import type { Metadata } from "next";

/**
 * The page in this folder is a Client Component, and those cannot export
 * `metadata`. This tiny layout does it instead, so the page gets its own
 * browser title. It renders nothing of its own.
 */
export const metadata: Metadata = {
  title: "Application review",
  description: "Review a candidate and move them along.",
};

export default function Layout({ children }: LayoutProps<"/recruiter/applications/[id]">) {
  return children;
}
