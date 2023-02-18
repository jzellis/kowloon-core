import connectMongo from "../../utils/connectMongo";
import { Settings, User, PostType, Circle } from "../../models";
import { defaultPostTypes } from "../../utils/defaults";
import Kowloon from "../../modules/kowloon";

export default async function handler(req, res) {
  await connectMongo();

  defaultPostTypes.forEach(async (type) => {
    await PostType.create(type);
  });
  try {
    await Settings.create(req.body.settings);
    const user = await Kowloon.addUser(req.body.user);
    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    res.status(200).json({ error: e });
  }
}
