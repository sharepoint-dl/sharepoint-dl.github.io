// Set this to the public URL of your Render service before deploying Pages.
const BACKEND_URL = "https://public-folder-downloader.onrender.com";

const form = document.querySelector("#download-form");
const input = document.querySelector("#share-link");
const button = form.querySelector("button");
const btnText = document.querySelector("#btn-text");
const btnSpinner = document.querySelector("#btn-spinner");
const message = document.querySelector("#message");

function setMessage(text, type = "info") {
  message.textContent = text;
  message.className =
    type === "error" ? "error" : type === "success" ? "success" : "";
}

function validateUrl(urlStr) {
  try {
    const url = new URL(urlStr.trim());
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const host = (url.hostname || "").toLowerCase();
    return (
      host.includes("onedrive") ||
      host.includes("sharepoint") ||
      host.includes("1drv.ms")
    );
  } catch {
    return false;
  }
}

input.addEventListener("input", () => {
  const val = input.value.trim();
  if (!val) {
    setMessage("");
    return;
  }
  if (!validateUrl(val)) {
    setMessage(
      "Please enter a valid OneDrive or SharePoint public folder link.",
      "error",
    );
  } else {
    setMessage("");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  let urlStr = input.value.trim();

  if (!validateUrl(urlStr)) {
    setMessage(
      "Please enter a valid OneDrive or SharePoint public folder link.",
      "error",
    );
    input.focus();
    return;
  }

  if (BACKEND_URL.includes("YOUR-RENDER-SERVICE")) {
    setMessage(
      "Set BACKEND_URL in frontend/script.js to your Render service URL before publishing.",
      "error",
    );
    return;
  }

  button.disabled = true;
  btnText.textContent = "Preparing...";
  btnSpinner.hidden = false;
  setMessage("Preparing your ZIP. Large folders may take a few minutes…");

  try {
    const response = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/api/download`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlStr }),
      },
    );
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.detail || "The download could not be prepared.");
    }
    const zip = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zip);
    link.download = "sharepoint-download.zip";
    link.click();
    URL.revokeObjectURL(link.href);
    setMessage("Your ZIP download has started!", "success");
  } catch (error) {
    setMessage(
      error.message || "The download failed. Check that the folder is public.",
      "error",
    );
  } finally {
    button.disabled = false;
    btnText.textContent = "Create ZIP";
    btnSpinner.hidden = true;
  }
});
