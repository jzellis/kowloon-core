import Kowloon from "../../../modules/kowloon";
import connectMongo from "../../../utils/connectMongo";

export default async function handler(req, res) {
  await connectMongo();
  switch (req.method) {
    case "GET":
      res.status(200).json(await Kowloon.post({ _id: req.query.id }));
      break;
    case "PUT":
      const q = await Kowloon.post({ _id: req.query.id });
      const updatedPost = await Kowloon.updatePost(q.post._id, req.body);
      res.status(200).json(updatedPost);

      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
