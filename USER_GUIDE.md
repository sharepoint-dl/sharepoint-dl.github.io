# User Guide: Public Folder ZIP Downloader (Web)

The web tool allows you to turn a public OneDrive or SharePoint folder into a single ZIP file for easy downloading.

## How to Use the Tool

1. **Get your link**: In OneDrive or SharePoint, right-click a folder and select **Share**. Ensure the setting is "Anyone with the link can view."
2. **Paste the link**: Copy that link and paste it into the input box on the website.
3. **Create ZIP**: Click the **Create ZIP** button.
4. **Wait**: The server will fetch the files and package them. For large folders, this may take several minutes. Keep the tab open.
5. **Download**: Your browser will automatically start the download of `sharepoint-download.zip` once it's ready.

## Common Questions

### Which links work?

The folder must be shared **publicly**. If you open the link in a private/incognito browser and it asks you to sign in, the tool cannot access it.

### Why is it taking so long?

Large folders with many files require the server to download everything from Microsoft's servers before Zipping them. Please be patient.

### Is my data safe?

Yes. The server does not store your files. It creates a temporary ZIP in memory or a temporary directory and deletes it immediately after the download is completed.
