"use client";

import Button from "./Button";
import { useSession } from "@/lib/hooks";

/**
 * The "I'm hiring" button on the home page.
 * Recruiters who are already signed in go straight to their dashboard;
 * everybody else is sent to the login page first.
 */
export default function HiringCta() {
  const { session } = useSession();
  const href = session?.role === "recruiter" ? "/recruiter/dashboard" : "/login";

  return (
    <Button href={href} variant="outline" size="lg">
      I&apos;m hiring
    </Button>
  );
}
