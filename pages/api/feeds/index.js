import Kowloon from "../../../modules/kowloon";
import connectMongo from "../../../utils/connectMongo";
import { User, Following, FeedItem } from "../../../models";
import axios from "axios";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
export default async function handler(req, res) {
  const parser = new Parser();
  await connectMongo();
  const response = { items: [] };
  const token = req.query.token || "";
  const user = await User.findOne({ loginToken: token });
  if (user) {
    switch (req.method) {
      case "GET":
        response.feeds = await Following.find({ userId: user._id }).sort({
          createdAt: -1,
        });
        break;
    }
    res.status(200).json(response);
  } else {
    response.error = "No user found!";
  }
}
