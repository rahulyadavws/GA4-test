import type { Candidate, CandidateProfile, Role } from "./types";

/**
 * The candidate the demo logs you in as. Their applications are the ones
 * shown under /candidate/applications.
 */
export const DEMO_CANDIDATE_ID = "cand-001";

/** Starting values for the profile form. The user can edit and save these. */
export const DEFAULT_PROFILE: CandidateProfile = {
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98200 41122",
  location: "Bengaluru, India",
  headline: "Frontend Engineer with a soft spot for design systems",
  experience: "4 years",
  currentCompany: "Bluepeak Software",
  expectedSalary: "28 LPA",
  noticePeriod: "60 days",
  skills: "React, TypeScript, Next.js, Tailwind CSS",
  about:
    "Frontend engineer with four years of experience building product interfaces for B2B SaaS. I care about design systems, accessibility and the small details that make a product feel finished.",
  portfolioUrl: "https://aaravsharma.dev",
  linkedinUrl: "https://linkedin.com/in/aarav-sharma",
  resumeFileName: "aarav-sharma-resume.pdf",
};

/** What a brand new account starts with, before they fill the profile in. */
export const BLANK_PROFILE: CandidateProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  experience: "",
  currentCompany: "",
  expectedSalary: "",
  noticePeriod: "30 days",
  skills: "",
  about: "",
  portfolioUrl: "",
  linkedinUrl: "",
  resumeFileName: "",
};

/**
 * Turns a login email into the id used to tag that person's applications,
 * saved jobs and profile.
 *
 * Emails that belong to one of the sample candidates keep that candidate's
 * seeded id, so logging in as the demo candidate shows their existing
 * application history. Any other email gets an id of its own and starts empty.
 */
export function userIdForEmail(email: string, role: Role): string {
  const normalised = email.trim().toLowerCase();
  if (role === "recruiter") return `rec-${normalised}`;

  const known = CANDIDATES.find((candidate) => candidate.email.toLowerCase() === normalised);
  return known ? known.id : `cand-${normalised}`;
}

/** The recruiter's talent pool. */
export const CANDIDATES: Candidate[] = [
  {
    id: "cand-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98200 41122",
    headline: "Frontend Engineer",
    location: "Bengaluru, India",
    experience: "4 years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    currentCompany: "Bluepeak Software",
  },
  {
    id: "cand-002",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 99401 77310",
    headline: "Senior Backend Engineer",
    location: "Chennai, India",
    experience: "7 years",
    skills: ["Python", "FastAPI", "PostgreSQL"],
    currentCompany: "Corevault Systems",
  },
  {
    id: "cand-003",
    name: "Vikram Joshi",
    email: "vikram.joshi@example.com",
    phone: "+91 90042 66127",
    headline: "DevOps Engineer",
    location: "Bengaluru, India",
    experience: "6 years",
    skills: ["Kubernetes", "Terraform", "AWS"],
    currentCompany: "Skyforge Cloud",
  },
  {
    id: "cand-004",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 89760 31245",
    headline: "Computer Science Student",
    location: "Hyderabad, India",
    experience: "Fresher",
    skills: ["JavaScript", "React", "HTML", "CSS"],
    currentCompany: "-",
  },
  {
    id: "cand-005",
    name: "Rohan Deshpande",
    email: "rohan.deshpande@example.com",
    phone: "+91 98902 55418",
    headline: "Product Designer",
    location: "Pune, India",
    experience: "5 years",
    skills: ["Figma", "Design Systems", "User Research"],
    currentCompany: "Studio Kernel",
  },
];
