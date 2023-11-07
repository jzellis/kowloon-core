import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) {
    let reply = req.body;
    Kowloon.setUser(req.user);
    response = await Kowloon.createReply(reply);
  } else {
    status = 401;
    response = { error: "You are not logged in or authorized to do this." };
  }

  res.status(status).json(response);
}
