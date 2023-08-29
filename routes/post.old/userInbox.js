import Kowloon from "../../kowloon/index.js";

export default async function handler(req, res, next) {
  let response = {};
  let status = 200;
  try {
    response = await Kowloon.addToInbox(activity);
  } catch (e) {
    status = 500;
    response = e;
  }

  res.status(status).json(response);
}
