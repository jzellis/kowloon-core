import Kowloon from "../../../modules/kowloon";
import connectMongo from "../../../utils/connectMongo";

export default async function handler(req, res) {
  await connectMongo();
  switch (req.method) {
    case "GET":
      res.status(200).json(await Kowloon.posts());
      break;
    case "POST":
      res.status(200).json(await Kowloon.addPost(req.body));
      //   const userq = await Kowloon.user({ username: req.query.username });
      //   const updatedUser = await Kowloon.updateUser(userq.user._id, req.body);
      //   res.status(200).json(updatedUser);

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
