import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Ban, Lock, Rocket, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

import GlassCard from "../components/GlassCard";

const features = [
  { title: "Fast", body: "Local-first storage keeps transfers simple and predictable.", icon: Rocket },
  { title: "Secure", body: "Random filenames, hard-to-guess share IDs, and path traversal protection.", icon: Lock },
  { title: "No Ads", body: "A clean open-source product without tracking clutter.", icon: Ban },
  { title: "Easy Sharing", body: "Every upload returns a copy-ready link and QR code.", icon: Share2 }
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan">
            <BadgeCheck size={16} />
            Open-source file sharing for teams and makers
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal sm:text-7xl">
            Upload. Share. Download.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Grazex-FileDrop turns any supported file into a clean download page in seconds, with previews,
            statistics, and a management view built for real workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-semibold text-ink transition hover:bg-mint" to="/upload">
              Upload file
              <ArrowRight size={18} />
            </Link>
            <Link className="inline-flex items-center rounded-lg border border-line bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10" to="/files">
              View files
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="relative"
        >
          <GlassCard className="p-5">
            <div className="rounded-lg border border-line bg-black/30 p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/48">Latest upload</p>
                  <p className="font-medium">brand-assets.zip</p>
                </div>
                <span className="rounded-lg bg-mint/15 px-3 py-1 text-sm text-mint">Ready</span>
              </div>
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-cyan to-mint" />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {["42.8 MB", "12 links", "98 downloads"].map((item) => (
                    <div key={item} className="rounded-lg border border-line bg-white/[0.04] p-3 text-center text-white/76">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="border-y border-line bg-white/[0.03] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
              <GlassCard className="h-full p-5">
                <feature.icon className="mb-5 text-cyan" size={26} />
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/58">{feature.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Grazex-FileDrop is released as open-source software.</p>
        <p>MIT License</p>
      </footer>
    </>
  );
}
