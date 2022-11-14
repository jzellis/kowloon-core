import Kowloon from "../../modules/kowloon";
import connectMongo from "../../utils/connectMongo";
export default async function handler(req, res) {
  await connectMongo();
  let response = await Kowloon.settings();

  res.status(200).json(response);
}
