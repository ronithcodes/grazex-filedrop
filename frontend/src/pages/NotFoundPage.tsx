import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm uppercase text-cyan">404</p>
        <h1 className="mt-3 text-5xl font-semibold">Page not found</h1>
        <p className="mt-4 text-white/58">This page does not exist or the link has expired.</p>
        <Link className="mt-7 inline-flex rounded-lg bg-cyan px-5 py-3 font-semibold text-ink transition hover:bg-mint" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
