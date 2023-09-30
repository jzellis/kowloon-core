import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};

  let activity = await Kowloon.getActivity(req.params.id);
  // activity.object = await Kowloon.getPost(activity.object);
  response = activity;

  res.status(status).json(response);
}
