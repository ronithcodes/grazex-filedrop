import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppShell from "./components/AppShell";
import DownloadPage from "./pages/DownloadPage";
import LandingPage from "./pages/LandingPage";
import MyFilesPage from "./pages/MyFilesPage";
import NotFoundPage from "./pages/NotFoundPage";
import UploadPage from "./pages/UploadPage";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/files" element={<MyFilesPage />} />
          <Route path="/f/:id" element={<DownloadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
      <Toaster position="bottom-right" toastOptions={{ className: "glass-toast" }} />
    </BrowserRouter>
  </React.StrictMode>
);
