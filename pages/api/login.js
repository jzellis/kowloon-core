import Kowloon from "../../modules/kowloon";

export default async function handler(req, res) {
  const l = req.body.login || req.query.login;
  const p = req.body.password || req.query.password;
  let response = await Kowloon.login(l, p);

  res.status(200).json(response);
}
