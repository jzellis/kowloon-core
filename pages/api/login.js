import Kowloon from "../../modules/kowloon";
import connectMongo from "../../utils/connectMongo";

export default async function handler(req, res) {
  await connectMongo();
  const l = req.body.login || req.query.login;
  const p = req.body.password || req.query.password;
  let response = await Kowloon.login(l, p);

  res.status(200).json(response);
}
