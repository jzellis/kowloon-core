import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Post
 */

const postTypeSchema = new Schema(
  {
    name: String,
    slug: String,
    plural: String,
    description: String,
  },
  { timestamps: true }
);

const postType = mongoose.model("PostType", postTypeSchema);

const PostSchema = new Schema(
  {
    author: { type: ObjectId, required: true, ref: "User" },
    type: { type: String, required: true, default: "status" },
    title: { type: String, default: null }, // It can have a
    content: {
      html: { type: String, required: true },
      text: String,
      summary: String,
    },
    inReplyTo: String, // This is a URL ID
    link: String, // If it's a link, this is what it's linked to
    image: String, // If it has a single image or featured image, this is the URL
    attachments: [{ type: ObjectId, ref: "Media" }], // Can be anything, though usually audio or video or images
    published: { type: Boolean, default: true },
    public: { type: Boolean, default: false },
    circles: [{ type: ObjectId, ref: "Circle" }],
    tags: [String],
    deleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    language: { type: String, default: "EN" },
  },
  { timestamps: true }
);

PostSchema.pre("save", async function (next) {
  // this.content.html = sanitizeHtml(this.content.html, {
  //   allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
  // });
  if (!this.content.text) this.content.text = htmlToText(this.content.html);
  this.content.summary = this.content.text.split(".").slice(0, 1) + ".";
  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
