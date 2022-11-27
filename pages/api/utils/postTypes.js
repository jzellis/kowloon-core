import Kowloon from "../../../modules/kowloon";
import connectMongo from "../../../utils/connectMongo";
import { PostType } from "../../../models";

export default async function handler(req, res) {
  const response = {};
  await connectMongo();
  let postTypes = await PostType.find();
  response.types = postTypes;
  res.status(200).json(response);
}
