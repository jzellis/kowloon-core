import { Actor, User } from "../../schema/index.js";

export default async function (user) {
  let createdUser = await User.create({
    username: user.username,
    password: user.password,
    email: user.email,
    name: user.name,
  });

  let actor = {
    name: user.name,
    bio: user.bio,
    username: user.username,
    location: user.location,
    url: user.url,
    user: createdUser._id,
  };
  try {
    actor = await Actor.create(actor);
    user.actor = actor._id;
    await User.findOneAndUpdate(
      { _id: createdUser._id },
      { $set: { actor: actor._id } }
    );
    return await User.findOne({ _id: createdUser._id }).populate("actor");
  } catch (error) {
    return { error };
  }
}
