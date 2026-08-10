# Developer guide

## Architecture

```text
Browser → GitHub Pages (frontend) → Render API (backend) → OneDrive / SharePoint
                                      ↓
                                  ZIP response
```

`frontend/` is a static site. It sends a public folder link to the backend and
downloads the ZIP response. `backend/` uses FastAPI and the standard library to
read public SharePoint/OneDrive folder metadata, download its files into a
temporary directory, create a ZIP, and remove that directory after the response
has been sent.

## Local setup

Requirements: Python 3.9+ and a modern browser.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set the frontend endpoint in [`frontend/script.js`](frontend/script.js):

```js
const BACKEND_URL = "http://localhost:8000";
```

Serve `frontend/` with any static server, for example:

```bash
cd frontend
python3 -m http.server 8080
```

Open `http://localhost:8080`. The backend health check is available at
`http://localhost:8000/health`.

## Configuration

Copy [`backend/.env.example`](backend/.env.example) into your Render environment
variables or local shell. The backend reads:

| Variable | Default | Purpose |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | `*` | Comma-separated browser origins allowed to call the API. Use your exact GitHub Pages origin in production. |
| `MAX_CONCURRENT_DOWNLOADS` | `2` | Number of folder jobs allowed at once. |
| `MAX_FILES` | `1000` | Maximum number of files in one folder. |
| `MAX_DOWNLOAD_MB` | `1024` | Maximum remote folder size in MB. |
| `DOWNLOAD_TIMEOUT_SECONDS` | `90` | Timeout for each upstream request. |

An origin has no path: use `https://account.github.io`, not
`https://account.github.io/repository`.

## Deploy backend to Render

1. Push the project to GitHub.
2. In Render, select **New → Blueprint** and choose the repository.
3. Render reads [`render.yaml`](render.yaml), installs
   `backend/requirements.txt`, and runs `uvicorn main:app`.
4. Set `ALLOWED_ORIGINS` to the GitHub Pages origin.
5. Deploy and confirm `<render-url>/health` returns `{"status":"ok"}`.

## Deploy frontend to GitHub Pages

1. Replace the placeholder `BACKEND_URL` in `frontend/script.js` with your
   Render URL. Do not include `/api/download` at the end.
2. Push to `main`.
3. In **Repository Settings → Pages**, choose **GitHub Actions** as the source.
4. The workflow in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
   publishes `frontend/` after each push to `main`.

## Production notes

This is a public download proxy. Enforce conservative limits, monitor bandwidth
and disk usage, and add rate limiting or CAPTCHA before exposing it broadly.
Render services and reverse proxies may impose request-duration or response-size
limits, so test against realistic folders on your chosen plan. Never expose
service credentials in `frontend/`; browser code is public.
