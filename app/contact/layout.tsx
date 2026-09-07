import type { Metadata } from "next";

/**
 * The page in this folder is a Client Component, and those cannot export
 * `metadata`. This tiny layout does it instead, so the page gets its own
 * browser title. It renders nothing of its own.
 */
export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the HireDesk team.",
};

export default function Layout({ children }: LayoutProps<"/contact">) {
  return children;
}
