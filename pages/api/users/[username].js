import Kowloon from "../../../modules/kowloon";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      res
        .status(200)
        .json(await Kowloon.user({ username: req.query.username }));
      break;
    case "PUT":
      const userq = await Kowloon.user({ username: req.query.username });
      const updatedUser = await Kowloon.updateUser(userq.user._id, req.body);
      res.status(200).json(updatedUser);

      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
