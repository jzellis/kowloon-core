import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  try {
    let actor = await Kowloon.getActor(req.params.id);
    if (
      Kowloon.user &&
      Kowloon.user.actor &&
      Kowloon.user.actor.id &&
      Kowloon.user.actor.id == actor.id
    ) {
      let isValid = Kowloon._validateActivity(req.body);
      if (isValid) {
        response = await Kowloon.createActivity(req.body);
      } else {
        response = { error: isValid.errors };
      }
    }
  } catch (error) {
    response = { error };
  }
  res.status(status).json(response);
}
