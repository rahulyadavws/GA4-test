import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        We could not find that page
      </h1>
      <p className="mt-3 text-slate-600">
        The link may be out of date, or the page may have been removed.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/jobs" variant="outline">
          Browse jobs
        </Button>
      </div>
    </div>
  );
}
