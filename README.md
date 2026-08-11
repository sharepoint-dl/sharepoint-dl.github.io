# Public Folder ZIP Downloader

Turn a public OneDrive or SharePoint folder into one ZIP download.

Paste a shared folder link, click **Create ZIP**, and the site downloads the
folder and sends the ZIP file back to your browser. You do not need a GitHub or
Microsoft account to use a deployed instance.

## 🚀 How to Use the Tool

1. **Get your link**: In OneDrive or SharePoint, right-click a folder and select **Share**. Ensure the setting is "Anyone with the link can view."
2. **Paste the link**: Copy that link and paste it into the input box on the website.
3. **Create ZIP**: Click the **Create ZIP** button.
4. **Wait**: The server will fetch the files and package them. For large folders, this may take several minutes. Keep the tab open.
5. **Download**: Your browser will automatically start the download of `sharepoint-download.zip` once it's ready.

## 📖 Documentation

- 🛠️ **[Developer Guide](DEV_GUIDE.md)**: Local development, deployment, and technical architecture.

## ❓ Common Questions

### Which links work?
The folder must be shared **publicly**. If you open the link in a private/incognito browser and it asks you to sign in, the tool cannot access it.

### Why is it taking so long?
Large folders with many files require the server to download everything from Microsoft's servers before Zipping them. Please be patient.

### Is my data safe?
Yes. The server does not store your files. It creates a temporary ZIP in memory or a temporary directory and deletes it immediately after the download is completed.

## ⚙️ How it works

1. **Public Links**: The tool only works with links shared as "Anyone with the link can view."
2. **Transient Processing**: The server fetches the files, creates a temporary ZIP, and deletes the files immediately after the response finishes.
3. **No Storage**: Your links and files are never stored permanently on our servers.

## 🛠️ Deployment

This project is split into two parts:

- **Frontend**: Hosted on GitHub Pages (https://onedrive-dl.github.io).
- **Backend**: Hosted on Render.

See the [Developer Guide](DEV_GUIDE.md) for instructions on running your own instance.
