import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};
  response = { error: "This space intentionally left blank." };
  res.status(status).json(response);
}
