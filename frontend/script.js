// Set this to the public URL of your Render service before deploying Pages.
const BACKEND_URL = "https://public-folder-downloader.onrender.com";

const form = document.querySelector("#download-form");
const input = document.querySelector("#share-link");
const button = form.querySelector("button");
const message = document.querySelector("#message");

function setMessage(text, error = false) {
    message.textContent = text;
    message.className = error ? "error" : "";
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let url;
    try {
        url = new URL(input.value.trim());
        if (!["http:", "https:"].includes(url.protocol))
            throw new Error("protocol");
    } catch {
        setMessage("Enter a valid http or https public folder link.", true);
        input.focus();
        return;
    }

    if (BACKEND_URL.includes("YOUR-RENDER-SERVICE")) {
        setMessage(
            "Set BACKEND_URL in frontend/script.js to your Render service URL before publishing.",
            true,
        );
        return;
    }

    button.disabled = true;
    setMessage("Preparing your ZIP. Large folders may take a few minutes…");
    try {
        const response = await fetch(
            `${BACKEND_URL.replace(/\/$/, "")}/api/download`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url: url.href}),
            },
        );
        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(
                payload.detail || "The download could not be prepared.",
            );
        }
        const zip = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zip);
        link.download = "sharepoint-download.zip";
        link.click();
        URL.revokeObjectURL(link.href);
        setMessage("Your ZIP download has started.");
    } catch (error) {
        setMessage(
            error.message ||
                "The download failed. Check that the folder is public.",
            true,
        );
    } finally {
        button.disabled = false;
    }
});
