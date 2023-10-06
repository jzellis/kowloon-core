import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};
  response = {
    title: Kowloon.settings.title,
    description: Kowloon.settings.description,
    url: Kowloon.settings.domain,
    domain: Kowloon.settings.asDomain,
    publicKey: Kowloon.settings.publicKey,
    location: Kowloon.settings.location,
  };

  res.status(status).json(response);
}
