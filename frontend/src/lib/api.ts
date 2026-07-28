import axios from "axios";

export type StoredFile = {
  id: string;
  filename: string;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  upload_time: string;
  download_count: number;
  uploader: string | null;
  share_id: string;
  download_url: string;
};

export type UploadResponse = {
  file: StoredFile;
  message: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000"
});

export function publicShareUrl(shareId: string) {
  return `${window.location.origin}/f/${shareId}`;
}

export function downloadUrl(shareId: string) {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  return `${base}/download/${shareId}`;
}
