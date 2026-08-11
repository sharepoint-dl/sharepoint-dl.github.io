# Public Folder ZIP Downloader

Turn a public OneDrive or SharePoint folder into one ZIP download.

Paste a shared folder link, click **Create ZIP**, and the site downloads the
folder and sends the ZIP file back to your browser. You do not need a GitHub or
Microsoft account to use a deployed instance.

## 📖 Documentation

Detailed guides are available for different needs:

- 👤 **[User Guide](USER_GUIDE.md)**: How to use the tool, supported links, and troubleshooting.
- 🛠️ **[Developer Guide](DEV_GUIDE.md)**: Local development, deployment, and technical architecture.

## 🚀 How it works

1. **Public Links**: The tool only works with links shared as "Anyone with the link can view."
2. **Transient Processing**: The server fetches the files, creates a temporary ZIP, and deletes the files immediately after the response finishes.
3. **No Storage**: Your links and files are never stored permanently on our servers.

## 🛠️ Deployment

This project is split into two parts:

- **Frontend**: Hosted on GitHub Pages.
- **Backend**: Hosted on Render.

See the [Developer Guide](DEV_GUIDE.md) for instructions on running your own instance.
