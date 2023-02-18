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
        const following = await Following.find({ _id: req.query.id });
        response.feed = following;
        response.items = await FeedItem.find({ feed: req.query.id })
          .sort({ pubDate: -1 })
          .populate("feed");

        break;
    }
    res.status(200).json(response);
  } else {
    response.error = "No user found!";
  }
}
