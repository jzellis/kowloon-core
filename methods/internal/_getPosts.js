import { Post } from "../../schema/index.js";

export default async function handler(
  query = {},
  page = 1,
  options = {
    sort: "-published",
    populate: ["actors", "replies"],
    pageLength: 20,
  }
) {
  try {
    let items = await Post.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);
    console.log(options.sort);
    if (options.populate.length > 0) {
      items = await Promise.all(
        items.map(async (post) => {
          if (options.populate.includes("actors"))
            post.actor = await this.getActor(post.actor);

          if (options.populate.includes("replies"))
            post.replies = await Post.find({ id: { $in: post.replies } });

          return post;
        })
      );
    }
    return items;
  } catch (error) {
    return { error };
  }
}
