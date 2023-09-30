import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  response = await Kowloon.getActorByUsername(req.params.id);
  console.log(response);

  res.status(status).json(response);
}
