import User from "../schema/user.js";

export default async function handler(user) {
  const newUser = new User(user);
  const error = newUser.validateSync();
  if (error) {
    return error;
  } else {
    await newUser.save();
    return newUser;
  }
}
