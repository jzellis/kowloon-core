import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  response = await Kowloon.addInboxItem(req.body);
  res.status(status).json(response);
}
