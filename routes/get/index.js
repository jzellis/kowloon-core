import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};

  response = {
    title: Kowloon.settings.title,
    domain: Kowloon.settings.domain,
    asDomain: Kowloon.settings.asDomain,
    publicKey: Kowloon.settings.publicKey,
  };

  res.status(status).json(response);
}
