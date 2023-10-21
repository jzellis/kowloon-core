import Feed from "../schema/feed.js";
import Post from "../schema/post.js";
import Actor from "../schema/actor.js";
import Parser from "rss-parser";
import { getLinkPreview } from "link-preview-js";
const parser = new Parser({ maxRedirects: 100 });

export default async function handler(id) {
  let feed = await Feed.findOne({ id });
  let followers = await Actor.find({ following: feed.id });

  let fullfeed = await parser.parseURL(feed.href);
  return Promise.all(
    await fullfeed.items.map(async (item) => {
      let preview;
      let post = {
        actor: feed.id,
        attributedTo: feed.id,
        id: item.link,
        type: "Link",
        public: true,
        title: item.title,
        to: feed.id,
        source: {
          content: item.content,
          mediaType: "text/html",
        },
        published: item.pubDate,
        href: item.link,
        summary: item.contentSnippet,
        bto: followers.map((actor) => actor.id),
      };
      try {
        preview = await getLinkPreview(item.link);
        if (
          preview.images &&
          !item.content.split("?")[0].includes(preview.images[0].split("?")[0])
        ) {
          post.featuredImage = preview.images[0];
        }
      } catch (e) {}
      if (!(await Post.findOne({ id: post.id })))
        return await Post.create(post);
    })
  );
}
