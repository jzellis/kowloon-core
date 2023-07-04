import fs from "fs";
let subs = JSON.parse(await fs.readFileSync("subscriptions.json", "utf-8"));
import Parser from "rss-parser";

let subscriptions = [];
let actors = [];
const parser = new Parser({ timeout: 1000 });

subs.opml.body[0].outline.map((o) => {
  if (o.outline && o.outline.length > 0) {
    o.outline.map((r) => subscriptions.push(r["$"].xmlUrl));
  } else {
    subscriptions.push(o["$"].xmlUrl);
  }
});

await Promise.all(
  subscriptions.map(async (s) => {
    try {
      const feed = await parser.parseURL(s);
      if (feed.image) console.log(feed.image);
      let output = {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: feed.link,
        type: "Service",
        name: feed.title,
        summary: feed.description,
        url: feed.feedUrl ? feed.feedUrl : feed.link,
        outbox: feed.feedUrl,
      };
      if (feed.image)
        output.icon = {
          type: "Image",
          mediaType: `image/${
            feed.image.url
              ? feed.image.url.split(".").pop()
              : feed.image.split(".").pop()
          }`,
          url: feed.image.url ? feed.image.url : feed.image,
        };
      actors.push({ ...feed, items: undefined });
    } catch (e) {}
  })
);
fs.writeFileSync("rawoutput.json", JSON.stringify(actors, null, 4));
