import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let activity = req.body.activity;

  try {
    if (Kowloon.user?.actor?.id) {
      response = await Kowloon.createActivity(activity);
    } else {
      status = 401;
      response.error = "Unauthorized";
    }
  } catch (error) {
    console.log(error);
    response = { error };
  }
  res.status(status).json(response);
}
