import Post from "../schema/post.js";

export default async function handler(post) {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { id: post.id },
      { $set: post }
    );
    await this.createActivity({
      type: "Update",
      actor: updatedPost.actor,
      object: updatedPost.id,
      summary: `${updatedPost.actor} updated their ${updatedPost.type}`,
    });
    return updatedPost;
  } catch (e) {
    return { error: e };
  }
}
