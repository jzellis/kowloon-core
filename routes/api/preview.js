import { getLinkPreview } from "link-preview-js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) {
    let url = req.query.url;

    try {
      let preview = await getLinkPreview(url, { followRedirects: true });
      response = preview;
    } catch (e) {
      response.error = e;
    }
  } else {
    response = { error: "Not logged in" };
  }

  res.status(status).json(response);
}
