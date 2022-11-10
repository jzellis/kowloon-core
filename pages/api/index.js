import Kowloon from "../../modules/kowloon"

export default async function handler(req, res) {
  // const kowloon = new Kowloon();
  let settings = await Kowloon.settings();
  let user = await Kowloon.user({ username: "jzellis" })
  let circles = await Kowloon.circles({ user: user._id });
  // settings = JSON.parse(JSON.stringify(settings))
  res.status(200).json({ settings, user,circles })
  }
  