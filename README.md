# Grazex-FileDrop

Upload. Share. Download.

Grazex-FileDrop is a modern open-source file sharing platform. Users upload a supported file and instantly receive a hard-to-guess share link, a download page, a copy button, QR code, and download statistics.

![Grazex-FileDrop landing page](assets/landing-page.png)

## Features

- React, Vite, TypeScript, TailwindCSS, and Framer Motion frontend
- FastAPI, SQLAlchemy, and Pydantic backend
- PostgreSQL-ready persistence with a SQLite fallback for quick local testing
- Local upload storage using randomized filenames
- Drag-and-drop uploads with animated progress
- Share page with image previews
- QR code generation and copy-link workflow
- Search, rename, delete, and sort in My Files
- Configurable upload size and upload directory
- Extension validation, filename sanitization, and path traversal protection
- Rate limiting ready with SlowAPI
- Rich startup banner with server, database, upload folder, max upload size, API port, and startup time
- MIT licensed

## Screenshots

### Landing Page

![Landing page with product hero](assets/landing-page.png)

### Upload Experience

![Upload page with drag and drop progress](assets/upload-page.png)

### Download Page

![Download page with file metadata and download button](assets/download-page.png)

## Folder Structure

```text
filedrop/
  frontend/
  backend/
  uploads/
  database/
  docs/
  assets/
  README.md
  LICENSE
```

## Installation

Use two terminals: one for the API and one for the web app.

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

By default the backend uses local SQLite at `database/filedrop.db`, which is enough for development.

For PostgreSQL, start the included database from the project root:

```bash
docker compose up -d postgres
```

Then keep `DATABASE_URL` in `backend/.env` as:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/grazex_filedrop
```

For quick local testing without PostgreSQL, use:

```env
DATABASE_URL=sqlite:///../database/filedrop.db
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deployment

Full deployment instructions are in `docs/DEPLOYMENT.md`.

### Frontend On Vercel

Deploy the `frontend` directory as the Vercel project root.

Recommended Vercel settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend-domain.com
```

Also add your Vercel URL to the backend `CORS_ORIGINS` value.

The included `frontend/vercel.json` rewrites all routes to `index.html`, so direct links like `/f/AB12CD34` work after deployment.

### Backend Hosting

The FastAPI backend should be hosted on a service with persistent storage, or with an external object store if you replace local uploads. Good options are Render, Railway, Fly.io, a VPS, or Docker on your own server.

Vercel serverless functions are not recommended for this backend as-is because local uploaded files are not persistent in serverless runtimes.

For most users, start with Render for the backend and Vercel for the frontend.

## Configuration

Backend settings are loaded from `backend/.env`.

For local development, copy `backend/.env.example` only if you want to customize settings. The checked-in defaults already run with SQLite and local uploads.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLAlchemy database URL. |
| `SECRET_KEY` | JWT signing secret for optional authentication. |
| `MAX_UPLOAD_SIZE` | Max upload size in bytes. |
| `UPLOAD_FOLDER` | Local folder for uploaded files. |
| `API_HOST` | API bind host. |
| `API_PORT` | API port. |
| `AUTH_ENABLED` | Toggle for future auth-gated flows. |

## API Documentation

See `docs/API.md`. FastAPI also exposes interactive docs at `http://localhost:8000/docs`.

Core endpoints:

- `POST /upload`
- `GET /file/{id}`
- `GET /download/{id}`
- `GET /f/{id}`
- `DELETE /file/{id}`
- `GET /files`

## Security Notes

Grazex-FileDrop validates allowed extensions, enforces a configurable size limit during streaming upload, stores random disk filenames, sanitizes public filenames, and resolves upload paths to prevent traversal. JWT helpers are included so authentication can be enabled without redesigning the project.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Keep changes typed, focused, and documented.
4. Run frontend and backend checks before opening a pull request.

## License

MIT. See `LICENSE`.
