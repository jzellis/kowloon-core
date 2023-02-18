import Kowloon from "../../modules/kowloon";
import connectMongo from "../../utils/connectMongo";
import { Following, User } from "../../models";
export default async function handler(req, res) {
  await connectMongo();
  const response = {};
  const user = await User.findOne();

  if (user) {
    try {
      const following = await Following.create({
        name: "Engadget",
        description:
          "Engadget is a web magazine with obsessive daily coverage of everything new in gadgets and consumer electronics",
        avatar:
          "https://s.yimg.com/uu/api/res/1.2/MY4dy0l5_D8FiM8p8MASaw--~B/aD0yNDE7dz04MDA7YXBwaWQ9eXRhY2h5b24-/https://www.blogcdn.com/www.engadget.com/media/2006/09/eng_big_logo.jpg",
        homeUrl: "https://www.engadget.com/",
        feedUrl: "https://www.engadget.com/rss.xml",
        feedType: "rss",
        active: true,
        userId: user._id,
      });
      response.following = following;
    } catch (e) {
      response.error = e;
    }
  }
  res.status(200).json(response);
}
