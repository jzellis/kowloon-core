import { User} from "../../../../models";
import connectMongo from "../../../../utils/connectMongo";
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  connectMongo();
    let response = {};
    let user = await User.findOne({ username: req.body.username });
    let password = req.body.password ? await bcrypt.compare(req.body.password, user.password) : false;
    switch (true) {
        case !user:
            response.error = "No user found!";
            break;
        
        case password == false:
            response.error = "Invalid password";
            break;
        
        case (user && password == true):
            response.token = user.loginToken;
        break;
    }

    
    
  res.status(200).json(response)
  }
  