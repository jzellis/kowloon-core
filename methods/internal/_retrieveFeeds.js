import { Actor, Post } from "../../schema/index.js";
import Parser from "rss-parser";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
let parser = new Parser({ maxRedirects: 10, timeout: 10000 });

export default async function (feeds = []) {
  let totalItems = 0;
  try {
    await Promise.all(
      feeds.map(async (f) => {
        let feed = await Actor.findOne({ id: f });
        try {
          let rss = await parser.parseURL(feed.href);
          if (rss && rss.items) {
            let newItems = [];
            await Promise.all(
              rss.items.map(async (item) => {
                let preview = await getLinkPreview(item.link, {
                  followRedirects: "follow",
                });
                let activity = {
                  type: "Create",
                  objectType: "Post",
                  summary: `${feed.name} added a post to their RSS feed`,
                  actor: feed.id,
                  attributedTo: feed.id,
                  object: {
                    actor: feed.id,
                    type: "FeedItem",
                    title: item.title || undefined,
                    summary: item.contentSnippet || undefined,
                    source: {
                      content: item.content || undefined,
                      type: "text/html",
                    },
                    href: item.link || undefined,
                    featuredImage:
                      preview && preview.images ? preview.images[0] : undefined,
                    to: feed.following || [],
                    public: false,
                    published: item.isoDate
                      ? new Date(item.isoDate)
                      : undefined,
                  },
                };
                if (!(await Post.findOne({ href: item.link })))
                  newItems.push(await this.createActivity(activity));
                totalItems = totalItems + 1;
              })
            );
            return newItems;
          }
        } catch (e) {
          console.log(`${feed.name} can't be retrieved: ${e}`);
        }
        //endforeach
      })
    );
    return totalItems;
  } catch (error) {
    return { error };
  }
}
