"""HTTP API for downloading public OneDrive and SharePoint folders as ZIPs."""
from __future__ import annotations

import asyncio
import os
import shutil
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
from starlette.background import BackgroundTask

from downloader import create_download_archive


def positive_int(name: str, default: int) -> int:
    value = int(os.getenv(name, str(default)))
    if value < 1:
        raise RuntimeError(f"{name} must be positive")
    return value


MAX_CONCURRENT_DOWNLOADS = positive_int("MAX_CONCURRENT_DOWNLOADS", 2)
MAX_FILES = positive_int("MAX_FILES", 1_000)
MAX_DOWNLOAD_MB = positive_int("MAX_DOWNLOAD_MB", 1_024)
DOWNLOAD_TIMEOUT_SECONDS = positive_int("DOWNLOAD_TIMEOUT_SECONDS", 90)
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",") if origin.strip()]
download_slots = asyncio.Semaphore(MAX_CONCURRENT_DOWNLOADS)

app = FastAPI(title="Public folder downloader", docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class DownloadRequest(BaseModel):
    url: HttpUrl


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/download")
async def download(request: DownloadRequest) -> FileResponse:
    async with download_slots:
        try:
            archive, temporary_directory = await run_in_threadpool(
                create_download_archive,
                str(request.url),
                timeout=DOWNLOAD_TIMEOUT_SECONDS,
                max_files=MAX_FILES,
                max_total_bytes=MAX_DOWNLOAD_MB * 1_024 * 1_024,
            )
        except RuntimeError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
        except Exception:
            raise HTTPException(status_code=502, detail="Unable to download that public folder. Try another active sharing link.")

    return FileResponse(
        archive,
        media_type="application/zip",
        filename="sharepoint-download.zip",
        background=BackgroundTask(shutil.rmtree, Path(temporary_directory), ignore_errors=True),
    )
