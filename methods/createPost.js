import Post from "../schema/post.js";
import Activity from "../schema/activity.js";

export default async function handler(post) {
  if (!post.to || post.to.length === 0) post.to = [post.actor];

  const newPost = new Post(post);
  const error = newPost.validateSync();
  if (error) {
    return error;
  } else {
    await newPost.save();
    await this.createActivity({
      type: "Create",
      actor: newPost.actor,
      object: newPost.id,
      summary: `${newPost.actor} created a new ${newPost.type}`,
    });
    return newPost;
  }
}
