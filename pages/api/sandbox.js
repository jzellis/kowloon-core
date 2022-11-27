import Kowloon from "../../modules/kowloon";
import connectMongo from "../../utils/connectMongo";
import { PostType } from "../../models";
export default async function handler(req, res) {
  const response = {};
  //   const defaultPostTypes = [
  //     {
  //       name: "Status",
  //       value: "status",
  //       description: "A short status or update post, like a tweet.",
  //     },
  //     {
  //       name: "Post",
  //       value: "post",
  //       description: "A longer post, with an optional title.",
  //     },
  //     {
  //       name: "Media",
  //       value: "media",
  //       description: "An image, audio or video.",
  //     },
  //     {
  //       name: "Link",
  //       value: "link",
  //       description: "A link with a title and description.",
  //     },
  //   ];

  //   const postTypes = await PostType.find({});
  //   if (postTypes.length == 0) {
  //     response.added = [];
  //     defaultPostTypes.forEach(async (type) => {
  //       await PostType.create(type);
  //       response.added.push(`${type.name} added!`);
  //     });
  //   }
  res.status(200).json(response);
}
