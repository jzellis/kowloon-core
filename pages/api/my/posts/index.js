import { User,Post,Circle } from "../../../../models";
import connectMongo from "../../../../utils/connectMongo";
const showdown = require('showdown');
export default async function handler(req, res) {
  connectMongo();
  let response = {sent:"OK"};
  switch (req.method) {
    case "POST":



      
      let user = await User.findOne({ _id: req.body.post.author });
      const token = req.headers.authorization.split(" ")[1];
      if (token != user.loginToken) {
        response = { status: "error", message: "Token invalid" }
      } else {
        try {

          let post = {
            author: req.body.post.author,
            public: req.body.post.public,
            circles: req.body.post.circles,
            title: req.body.post.title,
            content: { text: req.body.post.content }
          }

          if (user.prefs.useMarkdown === true) {
            const converter = new showdown.Converter();
            post.content.html = converter.makeHtml(post.content.text);      

          }

          let newPost = await Post.create(post);
          response = { status: "OK", post: newPost };
        } catch (e) {
          response = { status: "error", message: e }
        }
      }
      // console.log(user);

    break;
  }
  res.status(200).json({ response })
  }
  