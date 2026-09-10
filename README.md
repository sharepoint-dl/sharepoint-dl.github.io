# Public Folder ZIP Downloader

Turn a public OneDrive or SharePoint folder into a single ZIP download.

[Open the website →](https://sharepoint-dl.github.io)

Paste a public folder link, select **Create ZIP**, and the service fetches the folder, packages it, and starts the download in your browser. You do not need a Microsoft or GitHub account to use a deployed instance.

> Need a repeatable local mirror instead of a ZIP? Use the [OneDrive/SharePoint CLI sync tool](https://github.com/sharepoint-dl/sharepoint-dl).

## Use it in five steps

1. In OneDrive or SharePoint, open the folder’s **Share** menu.
2. Choose **Anyone with the link can view**, then copy the folder link.
3. Paste the link into the website.
4. Select **Create ZIP** and keep the tab open while the archive is prepared.
5. Download `sharepoint-download.zip` when your browser prompts you.

For large folders, preparation can take a few minutes: the server has to retrieve every file before it can create the archive.

## What links work?

Only public **folder** links work. A quick test: open the link in a private/incognito browser window. If Microsoft asks you to sign in, the service cannot download it.

## Privacy and limits

- Your sharing link and files are not stored permanently.
- Files are downloaded into a temporary server directory, zipped, and removed after the response finishes.
- The service has file-count and total-size limits to keep the public endpoint reliable. A deployment can tune these limits through environment variables.

## Run your own instance

This repository has a static frontend and a Python API:

```text
frontend/  → GitHub Pages or any static host
backend/   → FastAPI service (Render configuration included)
```

For complete local setup, deployment, configuration, and API details, read the [Developer Guide](DEV_GUIDE.md).

## Troubleshooting

**The service says the link is invalid or inaccessible**

Confirm the link points to a folder and is available to anyone with the link. Re-copy the link from the Share dialog if necessary.

**The archive takes a long time**

The service must download the remote folder before returning the ZIP. Large folders, many small files, and Microsoft rate limits can all increase the wait.

**The request is rejected for size or file count**

The folder exceeds the current deployment’s safety limits. If you operate the service, increase the appropriate backend limit only after considering available disk, bandwidth, and request capacity.

## License

Released under the [MIT License](LICENSE).
