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
        const following = await Following.find({ userId: user._id });

        try {
          await Promise.all(
            following.map(async (feed) => {
              let rss = await parser.parseURL(feed.feedUrl);

              let mappedItems = await Promise.all(
                rss.items.map(async (item) => {
                  const $ = cheerio.load(item.content, null, false);
                  $("a").attr("target", "_blank");
                  try {
                    const parsed = await axios.get(
                      "http://localhost:3000/api/utils/preview?url=" + item.link
                    );
                  } catch (e) {
                    response.error = e;
                  }
                  const img = parsed.data.preview.images
                    ? parsed.data.preview.images[0]
                    : feed.avatar;
                  // const img = feed.avatar;
                  return {
                    feed: feed._id,
                    author: item.creator,
                    title: item.title,
                    site: feed.name,
                    url: item.link,
                    image: img,
                    postType: "rss",
                    content: {
                      description: item.contentSnippet,
                      html: $.html(),
                      text: $.text(),
                    },
                    pubDate: item.pubDate,
                  };
                })
              );
              mappedItems.sort((a, b) => a.pubDate - b.pubDate);
              await Promise.all(
                mappedItems.map(
                  async (item) =>
                    await FeedItem.findOneAndUpdate({ url: item.url }, item, {
                      upsert: true,
                    })
                )
              );
            })
          );
        } catch (e) {
          response.error = e;
          console.log(e);
        }
        response.items = await FeedItem.find()
          .sort({ pubDate: -1 })
          .populate("feed");

        break;
      case "PUT":
        const post = await FeedItem.findOneAndUpdate(
          { _id: req.body.id },
          { $set: req.body.post }
        );
        response.post = post;
        break;
    }
    res.status(200).json(response);
  } else {
    response.error = "No user found!";
  }
}
