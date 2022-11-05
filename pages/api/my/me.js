// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User,Media } from '../../../models';
import connectMongo from "../../../utils/connectMongo";


export default async function handler(req, res) {

  console.log(req.body)
  await connectMongo();

  let username = req.body.username;
  let email = req.body.email.toLowerCase();
  let password = await bcrypt.hash(req.body.password, 10);
  let displayName = req.body.displayName;
  let user = await User.create({ username, email, password, displayName });
  let token = jwt.sign({ user_id: user._id, email, password },process.env.TOKEN_KEY)
  user.loginToken = token;
  await user.save();

  res.status(200).json({ token });


}
  