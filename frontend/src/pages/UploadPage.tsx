import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { CheckCircle2, Clipboard, FileUp, Link as LinkIcon, Loader2 } from "lucide-react";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import FileMeta from "../components/FileMeta";
import GlassCard from "../components/GlassCard";
import { StoredFile, api, publicShareUrl } from "../lib/api";
import { formatBytes } from "../lib/format";

const supported = ["Images", "Videos", "PDF", "TXT", "ZIP", "DOCX"];

export default function UploadPage() {
  const [selected, setSelected] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState<StoredFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareUrl = useMemo(() => (uploaded ? publicShareUrl(uploaded.share_id) : ""), [uploaded]);

  function pickFile(file?: File) {
    if (!file) return;
    setSelected(file);
    setUploaded(null);
    setProgress(0);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    pickFile(event.dataTransfer.files[0]);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    pickFile(event.target.files?.[0]);
  }

  async function upload() {
    if (!selected) {
      toast.error("Choose a file first");
      return;
    }
    const formData = new FormData();
    formData.append("upload", selected);
    setIsUploading(true);
    try {
      const { data } = await api.post<{ file: StoredFile }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      setUploaded(data.file);
      setProgress(100);
      toast.success("Download link created");
    } catch {
      toast.error("Upload failed. Check the API server and file limits.");
    } finally {
      setIsUploading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase text-cyan">Secure upload</p>
        <h1 className="mt-2 text-4xl font-semibold">Create a shareable link</h1>
      </div>

      <GlassCard className="p-5 sm:p-8">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="group grid min-h-72 cursor-pointer place-items-center rounded-lg border border-dashed border-cyan/35 bg-cyan/[0.04] p-8 text-center transition hover:bg-cyan/[0.08]"
        >
          <input ref={inputRef} type="file" className="hidden" onChange={onInput} />
          <motion.div animate={{ y: isUploading ? [0, -8, 0] : 0 }} transition={{ repeat: isUploading ? Infinity : 0, duration: 1.1 }}>
            <FileUp className="mx-auto mb-5 text-cyan" size={46} />
            <p className="text-2xl font-semibold">Drag and drop</p>
            <p className="mt-2 text-white/58">or click to upload</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {supported.map((item) => (
                <span key={item} className="rounded-lg border border-line bg-white/5 px-3 py-1 text-xs text-white/60">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {selected && (
          <div className="mt-6 rounded-lg border border-line bg-white/[0.04] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{selected.name}</p>
                <p className="text-sm text-white/48">{formatBytes(selected.size)}</p>
              </div>
              <button
                onClick={upload}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan px-5 py-3 font-semibold text-ink transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                Upload
              </button>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan to-mint transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </GlassCard>

      {uploaded && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <GlassCard className="p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-mint" />
              <h2 className="text-2xl font-semibold">Your link is ready</h2>
            </div>
            <FileMeta file={uploaded} />
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto]">
              <div className="rounded-lg border border-line bg-black/25 p-4">
                <p className="mb-2 text-xs uppercase text-white/45">Download Link</p>
                <div className="flex gap-2">
                  <span className="min-w-0 flex-1 truncate rounded-lg bg-white/5 px-3 py-3 text-white/72">{shareUrl}</span>
                  <button onClick={copyLink} className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/16" aria-label="Copy download link">
                    <Clipboard size={18} />
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <QRCodeSVG value={shareUrl} size={132} />
              </div>
            </div>
            <a className="mt-5 inline-flex items-center gap-2 text-cyan" href={shareUrl}>
              <LinkIcon size={17} />
              Open download page
            </a>
          </GlassCard>
        </motion.div>
      )}
    </section>
  );
}
