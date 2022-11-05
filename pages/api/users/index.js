// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongo from "../../../utils/connectMongo";
import {Posts} from "../../../models/";
export default async function handler(req, res) {

    await connectMongo();

    let posts = await Posts.find();
    res.status(200).json({ users: posts })
  }
  