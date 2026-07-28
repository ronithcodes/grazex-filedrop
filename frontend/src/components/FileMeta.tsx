import { Calendar, Download, FileType, HardDrive } from "lucide-react";

import { StoredFile } from "../lib/api";
import { formatBytes, formatDate } from "../lib/format";

type Props = {
  file: StoredFile;
};

export default function FileMeta({ file }: Props) {
  const rows = [
    { label: "Type", value: file.extension.toUpperCase(), icon: FileType },
    { label: "Size", value: formatBytes(file.size), icon: HardDrive },
    { label: "Created", value: formatDate(file.upload_time), icon: Calendar },
    { label: "Downloads", value: file.download_count.toString(), icon: Download }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 rounded-lg border border-line bg-white/[0.04] p-4">
          <row.icon className="text-cyan" size={20} />
          <div>
            <p className="text-xs uppercase text-white/45">{row.label}</p>
            <p className="font-medium text-white">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
