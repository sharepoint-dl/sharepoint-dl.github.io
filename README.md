# Public Folder ZIP Downloader

Turn a public OneDrive or SharePoint folder into one ZIP download.

Paste a shared folder link, click **Create ZIP**, and the site downloads the
folder and sends the ZIP file back to your browser. You do not need a GitHub or
Microsoft account to use a deployed instance.

## How to use it

1. Open the website provided by its owner.
2. In OneDrive or SharePoint, copy the link to the **folder** you want to
   download.
3. Paste the link into the box on the website.
4. Click **Create ZIP**.
5. Keep the page open while the folder is fetched and packaged.
6. Your browser downloads `sharepoint-download.zip` when it is ready.

## Which links work?

The folder must be shared publicly. A quick check is to open the link in an
incognito/private browser window: it must open without asking you to sign in.

This tool will not work for:

- private links that require a Microsoft account;
- expired, revoked, or organisation-restricted links;
- individual file links (it is for folders); or
- folders whose owner has disabled downloads.

## What happens to my link and files?

The server uses the submitted link only to fetch the public folder, creates a
temporary ZIP, returns it to your browser, and removes the temporary files when
the response finishes. It cannot bypass access restrictions and does not turn a
private share into a public one.

Large folders can take a few minutes. The service owner may set limits for file
count, total size, or simultaneous downloads; if you exceed one, the site will
show an error.

## Need to run your own instance?

This project hosts its frontend on GitHub Pages and its download API on Render.
See [DEVELOPMENT.md](DEVELOPMENT.md) for local development, deployment, limits,
and configuration.
