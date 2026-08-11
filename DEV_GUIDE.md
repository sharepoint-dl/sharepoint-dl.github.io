# Developer Guide: Public Folder ZIP Downloader (Web)

## System Architecture

The web application consists of two main parts:

1. **Frontend**: A static HTML/CSS/JS site hosted on GitHub Pages.
2. **Backend**: A Python API hosted on Render.

### Workflow

1. The frontend sends a POST request to `/api/download` with the shared folder URL.
2. The backend uses the `downloader.py` logic to:
   - Validate the URL.
   - Fetch the public folder's contents.
   - Download files to a temporary directory.
   - Create a ZIP archive of those files.
3. The backend streams the ZIP file back to the user's browser as a blob.
4. The temporary files are deleted immediately after the response.

## Deployment & Configuration

### Backend (Render)

The backend is deployed as a Web Service on Render.

- **Runtime**: Python 3.
- **Dependencies**: Only standard library (dependency-free).
- **Limits**: To prevent abuse, the `create_download_archive` function enforces:
  - `max_files`: Maximum number of files per ZIP.
  - `max_total_bytes`: Maximum total size of the ZIP.

### Frontend (GitHub Pages)

The frontend is a simple static site.

- **`BACKEND_URL`**: You must set the `BACKEND_URL` constant in `frontend/script.js` to point to your deployed Render service.

## Local Development

1. Run the backend locally using a framework like FastAPI or Flask that wraps the `create_download_archive` function.
2. Serve the `frontend` folder using a local server (e.g., `python3 -m http.server`).
3. Update `BACKEND_URL` to `http://localhost:port`.
