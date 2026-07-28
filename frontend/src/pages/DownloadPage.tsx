import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FileMeta from "../components/FileMeta";
import GlassCard from "../components/GlassCard";
import { StoredFile, api, downloadUrl } from "../lib/api";

export default function DownloadPage() {
  const { id } = useParams();
  const [file, setFile] = useState<StoredFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<StoredFile>(`/file/${id}`)
      .then((response) => setFile(response.data))
      .catch(() => setFile(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Loader2 className="animate-spin text-cyan" size={42} />
      </div>
    );
  }

  if (!file || !id) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold">File not found</h1>
        <p className="mt-3 text-white/58">The link may be invalid or the file may have been deleted.</p>
      </section>
    );
  }

  const isImage = file.mime_type.startsWith("image/");

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="overflow-hidden">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid min-h-80 place-items-center border-b border-line bg-black/35 p-6 lg:border-b-0 lg:border-r">
              {isImage ? (
                <img className="max-h-[440px] rounded-lg object-contain" src={downloadUrl(id)} alt={file.original_name} />
              ) : (
                <div className="grid h-40 w-40 place-items-center rounded-lg border border-line bg-white/[0.04] text-4xl font-semibold text-cyan">
                  {file.extension.toUpperCase()}
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm uppercase text-cyan">Download</p>
              <h1 className="mt-3 break-words text-3xl font-semibold">{file.original_name}</h1>
              <div className="mt-6">
                <FileMeta file={file} />
              </div>
              <a
                href={downloadUrl(id)}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan px-6 py-4 font-semibold text-ink transition hover:bg-mint sm:w-auto"
              >
                <Download size={19} />
                Download file
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
