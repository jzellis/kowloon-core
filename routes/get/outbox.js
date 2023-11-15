import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let query = {};
  if (req.query.type) query.type = req.query.type;
  let page = req.query.page || 1;
  let total = await Kowloon._countPosts(query);
  let items = await Kowloon._getPosts(query);
  response = {
    page,
    total,
    items,
    length: items.length,
  };
  res.status(status).json(response);
}
