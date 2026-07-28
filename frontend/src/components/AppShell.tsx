import { Github, UploadCloud } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Upload", href: "/upload" },
  { label: "My Files", href: "/files" }
];

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(41,211,255,0.18),transparent_28%),radial-gradient(circle_at_85%_5%,rgba(110,243,191,0.14),transparent_24%),linear-gradient(180deg,#070A12_0%,#0B1020_54%,#070A12_100%)]" />
      <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold tracking-wide">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/15 text-cyan ring-1 ring-cyan/30">
              <UploadCloud size={21} />
            </span>
            <span>Grazex-FileDrop</span>
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? "bg-white/12 text-white" : "text-white/68 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href="https://github.com/"
              aria-label="Open source repository"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white/5 text-white/70 transition hover:text-white"
            >
              <Github size={18} />
            </a>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
