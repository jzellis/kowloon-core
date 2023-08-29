import Kowloon from "../../kowloon/index.js";

export default async function handler(req, res, next) {
  let status = 401;
  Kowloon.setUser(req.user || undefined);
  if (Kowloon.user) {
    status = 201;
    const activity = req.body;
    response = await Kowloon.addActivity(activity);
    if (response.error) status = 400;
  } else {
    response = { error: "Unauthorized" };
  }

  res.status(status).json(response);
}
