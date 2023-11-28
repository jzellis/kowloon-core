/**
 * @namespace kowloon
 */
import { Actor, User } from "../../schema/index.js";

export default async function (user) {
  try {
    let createdUser = await User.create({
      username: user.username,
      password: user.password,
      email: user.email,
      name: user.name,
      publicKey: user.publicKey || undefined,
      privateKey: user.privateKey || undefined,
    });

    let actor = {
      type: user.type || "Person",
      name: user.name,
      bio: user.bio,
      username: user.username,
      location:
        typeof user.location === "string"
          ? { name: user.location || null }
          : user.location,
      url: [user.url],
      user: createdUser._id,
      publicKey: user.publicKey || undefined,
      privateKey: user.privateKey || undefined,
    };

    actor = await Actor.create(actor);
    user.actor = actor._id;
    await User.findOneAndUpdate(
      { _id: createdUser._id },
      { $set: { actor: actor._id } }
    );
    return await User.findOne({ _id: createdUser._id }).populate("actor");
  } catch (error) {
    console.log(error);
    return { error };
  }
}
