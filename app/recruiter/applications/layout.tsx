import type { Metadata } from "next";

/**
 * The page in this folder is a Client Component, and those cannot export
 * `metadata`. This tiny layout does it instead, so the page gets its own
 * browser title. It renders nothing of its own.
 */
export const metadata: Metadata = {
  // `default` titles this page; `template` keeps the suffix on the pages
  // nested below it (e.g. "Post a job | HireDesk").
  title: { default: "Applications", template: "%s | HireDesk" },
  description: "Every application across your roles.",
};

export default function Layout({ children }: LayoutProps<"/recruiter/applications">) {
  return children;
}
