import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let query = req.params.id;
  let post = await Kowloon.getPost(query);
  response = post && post != [] ? post : { error: "Post not found" };
  res.status(status).json(response);
}
