import { User, Post, Comment } from "../../models";
import sanitizeHtml from "sanitize-html";
import slugify from "../../utils/slugify";

/**
 *
 * @param {object} search - Search criteria
 * @param {object} options - Options object
 * @returns {object}
 */
const post = async function (search, fields) {
  search = search || {};
  fields = fields || {};
  search.deleted = false;
  fields.deleted = 0;
  const response = {};
  response.post = await Post.findOne(search, fields).populate({
    path: "author",
    select: "username _id",
  });
  return JSON.parse(JSON.stringify(response));
};

/**
 *
 * @param {object*} search
 * @param {*} options
 * @param {*} limit
 * @param {*} offset
 * @returns
 */

const posts = async function (search, fields, options) {
  search = search || {};
  fields = fields || {};
  options = options || {};
  search.deleted = false;
  fields.deleted = 0;
  options.limit = 0;
  options.offset = 0;
  const response = {};
  let posts = await Post.find(search, fields).sort({ createdAt: -1 }).populate({
    path: "author",
    select: "username _id",
  });
  response.posts = posts;

  return JSON.parse(JSON.stringify(response));
};

const addPost = async (data) => {
  let post = data;
  console.log("Sent data", post);
  let response = {};
  if (post.type === "status") delete post.title;
  if (post.title) post.slug = slugify(post.title);
  // This strips all the HTML from the post's plain text
  if (post.content.text)
    post.content.text = post.content.text.replace(/(<([^>]+)>)/gi, "");
  // This sanitizes the post's HTML to keep it clean
  if (post.content.html)
    post.content.html = sanitizeHtml(post.content.html, {
      allowedTags: ["b", "i", "em", "strong", "a", "ul", "ol", "li"],
      allowedAttributes: {
        a: ["href"],
      },
    });
  if (!post.content.description)
    post.content.description = post.content.text.substring(0, 100);

  try {
    response.post = await Post.create(post);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

const updatePost = async (postId, fields) => {
  let response = {};
  try {
    response.post = await Post.findByIdAndUpdate(postId, fields);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

export { post, posts, addPost, updatePost };
