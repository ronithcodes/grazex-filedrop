# Deployment Guide

This project has two deployable parts:

- `frontend`: a Vite static app. Deploy this to Vercel.
- `backend`: a FastAPI API with local file storage. Deploy this to a service that supports long-running web services and persistent storage.

## Recommended Setup

Use:

- Vercel for the frontend
- Render, Railway, Fly.io, or a VPS for the backend
- PostgreSQL for production metadata
- A persistent disk/volume for `UPLOAD_FOLDER`, or replace local storage with S3/R2 for larger production use

Do not deploy the backend as a serverless function if you need uploaded files to remain available. Local uploaded files are not durable in typical serverless runtimes.

## Frontend On Vercel

Create a new Vercel project from your GitHub repository.

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add this Vercel environment variable:

```env
VITE_API_URL=https://your-backend-domain.com
```

The included `frontend/vercel.json` makes direct links like `/f/AB12CD34` work after deployment.

## Backend On Render

Render is the easiest backend host for most first deployments.

Create a Render Web Service from your GitHub repository.

Recommended settings:

| Setting | Value |
| --- | --- |
| Service Type | Web Service |
| Root Directory | `backend` |
| Runtime | Python |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Add environment variables:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DATABASE
SECRET_KEY=replace-with-a-long-random-secret
MAX_UPLOAD_SIZE=104857600
UPLOAD_FOLDER=/var/data/uploads
AUTH_ENABLED=false
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

If using Render local disk storage, mount a persistent disk at:

```text
/var/data
```

Then `UPLOAD_FOLDER=/var/data/uploads`.

## Backend On Railway

Railway can deploy FastAPI directly from GitHub or with the included Dockerfile.

Use these environment variables:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DATABASE
SECRET_KEY=replace-with-a-long-random-secret
MAX_UPLOAD_SIZE=104857600
UPLOAD_FOLDER=/data/uploads
AUTH_ENABLED=false
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

For durable uploads, attach a volume and mount it at `/data`.

## Backend On Fly.io

Fly.io works well with the included `backend/Dockerfile`.

From the `backend` directory:

```bash
fly launch
fly deploy
```

For durable uploads, create and mount a Fly volume at `/data`.

## Production Notes

- Use PostgreSQL instead of SQLite for public deployments.
- Keep `SECRET_KEY` private.
- Set `CORS_ORIGINS` to your real frontend URL.
- Use HTTPS backend URLs in `VITE_API_URL`.
- Local disk uploads are simple, but object storage such as S3 or Cloudflare R2 is better for high traffic or multi-server deployments.
