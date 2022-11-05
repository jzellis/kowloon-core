// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectMongo from "../../../utils/connectMongo";
import { Post } from "../../../models/";
import {getPosts} from "./get"
export default async function handler(req, res) {

  await connectMongo();
  
  let posts
  switch (req.method) {
    case ("GET"):
      posts = await getPosts();
    break;

    case ("POST"):
      posts = await getPosts();
    break;


  }
  res.status(200).json({ posts: posts });
  } 
  