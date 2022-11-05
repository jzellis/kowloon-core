// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongo from "../../../utils/connectMongo";
import { Post } from "../../../models/";
import {getPost} from "./get"
export default async function handler(req, res) {

  await connectMongo();
  
  let post;
  let id = req.query;
  switch (req.method) {
    case ("GET"):
      post = await getPost(id);
    break;

    case ("PUT"):
      post = await getPosts();
    break;


  }
  res.status(200).json({ post: post });
  } 
  