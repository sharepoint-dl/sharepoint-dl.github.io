# Developer Guide — Public Folder ZIP Downloader

## Architecture

```text
Browser → static frontend → POST /api/download → FastAPI backend
                                              → public OneDrive/SharePoint folder
Browser ← streamed ZIP    ← temporary ZIP     ← temporary downloaded files
```

The frontend is plain HTML, CSS, and JavaScript. The backend is a FastAPI service that downloads a public folder, creates a ZIP, streams it to the client, and removes temporary data after the response completes.

## Repository layout

| Path                    | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `frontend/`             | Static site for GitHub Pages or another static host.       |
| `frontend/script.js`    | Browser validation and the configured `BACKEND_URL`.       |
| `backend/main.py`       | FastAPI app, CORS, limits, and HTTP endpoints.             |
| `backend/downloader.py` | Public-folder discovery, download logic, and ZIP creation. |
| `backend/.env.example`  | Backend configuration template.                            |
| `render.yaml`           | Render Blueprint for the backend service.                  |

## Run locally

### 1. Start the API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000 --env-file .env
```

The API health check is available at `http://localhost:8000/health`.

### 2. Serve the frontend

In a second terminal, from the repository root:

```bash
python3 -m http.server 8080 --directory frontend
```

Set `BACKEND_URL` in `frontend/script.js` to `http://localhost:8000`, then open `http://localhost:8080`.

## Configuration

Copy `backend/.env.example` to `backend/.env`, or configure these variables in your host. The supplied values are conservative production defaults.

| Variable                   | Meaning                                                                                    | Default |
| -------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| `ALLOWED_ORIGINS`          | Comma-separated origins permitted to call the API. Use your exact Pages URL in production. | `*`     |
| `MAX_CONCURRENT_DOWNLOADS` | Requests allowed to prepare archives concurrently.                                         | `2`     |
| `MAX_FILES`                | Maximum files in one shared folder.                                                        | `1000`  |
| `MAX_DOWNLOAD_MB`          | Maximum combined remote-file size, in MB.                                                  | `1024`  |
| `DOWNLOAD_TIMEOUT_SECONDS` | Timeout per SharePoint request.                                                            | `90`    |

`render.yaml` installs `backend/requirements.txt`, starts Uvicorn, and exposes `/health` for health checks. Set `ALLOWED_ORIGINS` in Render to the URL of the deployed frontend. Then update `BACKEND_URL` in `frontend/script.js` to the public backend URL before publishing the frontend.

## API

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

### `POST /api/download`

Request body:

```json
{ "url": "https://your-public-folder-link" }
```

On success, returns a `application/zip` download named `sharepoint-download.zip`. Invalid, empty, or limit-exceeding shares return `400`; upstream download failures return `502`.

## Operational notes

- Only public OneDrive and SharePoint folder links are accepted.
- A semaphore limits concurrent archive creation; tune it to the memory, disk, and bandwidth available to your host.
- The backend removes the temporary directory only after the ZIP response completes.
- Configure a specific `ALLOWED_ORIGINS` value in production rather than relying on the permissive development default.

## License

This project is licensed under the [MIT License](LICENSE).
