import { User } from "../schema/index.js";
export default async function handler(token) {
  const user = await User.findOne({ accessToken: token }, "-password");
  if (!user) return { error: "Token not authorized" };
  return user;
}
