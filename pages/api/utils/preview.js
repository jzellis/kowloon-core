import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

export default async function handler(req, res) {
  const { url } = req.query;
  const response = {};
  try {
    const data = await getLinkPreview(url, {
      followRedirects: `manual`,
      handleRedirects: (baseURL, forwardedURL) => {
        const urlObj = new URL(baseURL);
        const forwardedURLObj = new URL(forwardedURL);
        if (
          forwardedURLObj.hostname === urlObj.hostname ||
          forwardedURLObj.hostname === "www." + urlObj.hostname ||
          "www." + forwardedURLObj.hostname === urlObj.hostname
        ) {
          return true;
        } else {
          return false;
        }
      },
    });
    response.preview = data;
  } catch (e) {
    response.error = e;
  }
  res.status(200).json(response);
}
