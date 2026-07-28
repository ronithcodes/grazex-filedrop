# Grazex-FileDrop API

Base URL: `http://localhost:8000`

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/upload` | Upload a file as multipart form data field `upload`. |
| `GET` | `/file/{id}` | Return metadata for a share ID. |
| `GET` | `/download/{id}` | Download the stored file and increment its count. |
| `GET` | `/f/{id}` | Short share-link route that redirects to download. |
| `DELETE` | `/file/{id}` | Delete metadata and local file. |
| `PATCH` | `/file/{id}` | Rename a file with `{ "original_name": "new-name.pdf" }`. |
| `GET` | `/files` | List files. Supports `search` and `sort`. |
| `GET` | `/health` | Health check. |

## Upload

```bash
curl -F "upload=@example.pdf" http://localhost:8000/upload
```

## Search And Sort

```bash
curl "http://localhost:8000/files?search=pdf&sort=downloads"
```

Valid `sort` values: `newest`, `name`, `size`, `downloads`.
