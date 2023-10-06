import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};

  let query = decodeURIComponent(req.params.query);
  response.actors = await Kowloon.queryActors({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
      { preferredUsername: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
    ],
  });

  response.posts = await Kowloon.queryPosts({
    $or: [
      { content: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
      { title: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
      { url: { $regex: query, $options: "i" } },
      { href: { $regex: query, $options: "i" } },
    ],
    public: true,
  });
  response.groups = await Kowloon.queryGroups({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });

  res.status(status).json(response);
}
