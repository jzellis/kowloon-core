import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let query = {
    $or: [
      { to: group.id },
      { cc: group.id },
      { bto: group.id },
      { bcc: group.id },
    ],
    public: true,
    deleted: { $exists: false },
  };

  if (req.user) Kowloon.setUser(req.user);
  let group = await Kowloon.getGroupById(req.params.id);
  let status = 200;
  let response = {};
  // This does nothing

  let page = req.query.page || 1;
  res.status(status).json(response);
}
