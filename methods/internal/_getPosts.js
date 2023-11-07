import { Post } from "../../schema/index.js";

export default async function handler(
  query = {},
  page = 1,
  options = {
    sort: "published",
    populate: ["actors", "replies"],
    pageLength: 20,
  }
) {
  try {
    console.log(query);
    let total = await Post.countDocuments({});
    console.log("Total: ", total);
    let posts = await Post.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);

    if (options.populate.length > 0) {
      posts = await Promise.all(
        posts.map(async (post) => {
          if (options.populate.includes("actors"))
            post.actor = await this.getActor(post.actor);

          if (options.populate.includes("replies"))
            post.replies = await Post.find({ id: { $in: post.replies } });

          return post;
        })
      );
    }
    return { page, total, posts };
  } catch (error) {
    return { error };
  }
}
