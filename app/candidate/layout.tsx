import RequireRole from "@/components/RequireRole";
import SidebarNav, { type NavItem } from "@/components/SidebarNav";

const NAV_ITEMS: NavItem[] = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/candidate/applications", label: "My Applications", icon: "📄" },
  { href: "/candidate/saved-jobs", label: "Saved Jobs", icon: "🔖" },
  { href: "/candidate/profile", label: "Profile", icon: "👤" },
  { href: "/jobs", label: "Browse Jobs", icon: "🔍" },
];

/**
 * Wraps every /candidate/* page with the candidate sidebar, and puts the whole
 * area behind a candidate login.
 */
export default function CandidateLayout({ children }: LayoutProps<"/candidate">) {
  return (
    <RequireRole role="candidate">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <SidebarNav title="Candidate" items={NAV_ITEMS} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireRole>
  );
}
