import { User, Post, Comment } from "../../models";
import sanitizeHtml from "sanitize-html";

/**
 *
 * @param {object} search - Search criteria
 * @param {object} options - Options object
 * @returns {object}
 */
const post = async function (
  search = {
    _id: null,
  },
  options = { user: true, comments: false }
) {
  let response = {};
  response.post = await Post.findOne(search);

  if (options.user == true) {
    response.post.author = await User.findOne({ _id: post.author });
  }
  if (options.comments == true) {
    response.comments = await Comment.find({ post: post._id });
  }

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

const posts = async function (
  search = {
    _id: null,
  },
  options = { users: true },
  limit = 0,
  offset = 0
) {
  let response = {};
  response.posts = await Post.find(search).limit(limit).skip(offset).exec();
  if (options.users == true) {
    response.posts.forEach(async (post) => {
      post.author = await User.findOne({ _id: post.author });
    });
  }

  return JSON.parse(JSON.stringify(response));
};

const addPost = async (post) => {
  // Add all the sanitizing and shit here
  let response = {};
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
