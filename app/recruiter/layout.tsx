import RequireRole from "@/components/RequireRole";
import SidebarNav, { type NavItem } from "@/components/SidebarNav";

const NAV_ITEMS: NavItem[] = [
  { href: "/recruiter/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/recruiter/jobs", label: "Manage Jobs", icon: "💼" },
  { href: "/recruiter/jobs/new", label: "Post a Job", icon: "➕" },
  { href: "/recruiter/applications", label: "Applications", icon: "📄" },
];

/**
 * Wraps every /recruiter/* page with the recruiter sidebar, and puts the whole
 * area behind a recruiter login.
 */
export default function RecruiterLayout({ children }: LayoutProps<"/recruiter">) {
  return (
    <RequireRole>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <SidebarNav title="Recruiter" items={NAV_ITEMS} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireRole>
  );
}
