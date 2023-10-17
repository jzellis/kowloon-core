import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) {
    let url = req.query.url;
    try {
      let preview = await getLinkPreview(url);
      response = preview;
    } catch (e) {}
  } else {
    response = { error: "Not logged in" };
  }

  res.status(status).json(response);
}
