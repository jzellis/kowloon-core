import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};

  let activity = await Kowloon.getActivity(req.params.id);
  if (!activity || activity.error) {
    response.error = "No activity found";
  } else {
    if (activity && !activity.error && activity.public === false)
      response.error = "You are not authorized to view this activity";
    if (
      (activity && !activity.error && activity.public == true) ||
      (Kowloon.user.actor &&
        activity.actor &&
        (activity.actor.id == Kowloon.user.actor.id ||
          activity.to.includes(Kowloon.user.actor.id) ||
          activity.bto.includes(Kowloon.user.actor.id) ||
          activity.cc.includes(Kowloon.user.actor.id) ||
          activity.bcc.includes(Kowloon.user.actor.id)))
    ) {
      response = activity;
    } else {
      response.error = "You are not authorized to view this activity";
    }
  }
  res.status(status).json(response);
}
