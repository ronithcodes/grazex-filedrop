import { Download, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import GlassCard from "../components/GlassCard";
import { StoredFile, api, publicShareUrl } from "../lib/api";
import { formatBytes, formatDate } from "../lib/format";

type Sort = "newest" | "name" | "size" | "downloads";

export default function MyFilesPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      api
        .get<StoredFile[]>("/files", { params: { search: query || undefined, sort } })
        .then((response) => setFiles(response.data))
        .catch(() => toast.error("Could not load files"))
        .finally(() => setLoading(false));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query, sort]);

  const totalDownloads = useMemo(() => files.reduce((sum, file) => sum + file.download_count, 0), [files]);

  async function deleteFile(shareId: string) {
    const confirmed = window.confirm("Delete this file permanently?");
    if (!confirmed) return;
    try {
      await api.delete(`/file/${shareId}`);
      setFiles((current) => current.filter((file) => file.share_id !== shareId));
      toast.success("File deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  async function renameFile(file: StoredFile) {
    const next = window.prompt("Rename file", file.original_name);
    if (!next || next === file.original_name) return;
    try {
      const { data } = await api.patch<StoredFile>(`/file/${file.share_id}`, { original_name: next });
      setFiles((current) => current.map((item) => (item.share_id === file.share_id ? data : item)));
      toast.success("File renamed");
    } catch {
      toast.error("Rename failed");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase text-cyan">Library</p>
          <h1 className="mt-2 text-4xl font-semibold">My Files</h1>
        </div>
        <div className="flex gap-3 text-sm text-white/58">
          <span>{files.length} files</span>
          <span>{totalDownloads} downloads</span>
        </div>
      </div>

      <GlassCard className="mb-5 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search filename or extension"
              className="h-12 w-full rounded-lg border border-line bg-white/5 pl-10 pr-3 outline-none transition placeholder:text-white/35 focus:border-cyan"
            />
          </label>
          <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="h-12 rounded-lg border border-line bg-[#101625] px-3 outline-none focus:border-cyan">
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="downloads">Downloads</option>
          </select>
        </div>
      </GlassCard>

      <div className="overflow-hidden rounded-lg border border-line bg-panel backdrop-blur-xl">
        <div className="hidden grid-cols-[1fr_120px_150px_120px_120px] border-b border-line px-4 py-3 text-xs uppercase text-white/42 md:grid">
          <span>File</span>
          <span>Size</span>
          <span>Uploaded</span>
          <span>Downloads</span>
          <span>Actions</span>
        </div>
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-lg bg-white/8" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="p-10 text-center text-white/58">No files match this search.</div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_120px_150px_120px_120px] md:items-center">
              <Link to={`/f/${file.share_id}`} className="min-w-0">
                <p className="truncate font-medium">{file.original_name}</p>
                <p className="truncate text-sm text-white/42">{publicShareUrl(file.share_id)}</p>
              </Link>
              <span className="text-sm text-white/68">{formatBytes(file.size)}</span>
              <span className="text-sm text-white/68">{formatDate(file.upload_time)}</span>
              <span className="text-sm text-white/68">{file.download_count}</span>
              <div className="flex gap-2">
                <a className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-white/70 hover:text-white" href={file.download_url} aria-label="Download">
                  <Download size={16} />
                </a>
                <button onClick={() => renameFile(file)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-white/70 hover:text-white" aria-label="Rename">
                  <Pencil size={16} />
                </button>
                <button onClick={() => deleteFile(file.share_id)} className="grid h-9 w-9 place-items-center rounded-lg bg-rose/15 text-rose hover:bg-rose/25" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
