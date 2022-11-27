import Kowloon from "../../../modules/kowloon";
import connectMongo from "../../../utils/connectMongo";
import formidable from "formidable";
import fs from "fs";
import slugify from "../../../utils/slugify";
import { Media } from "../../../models";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.filepath);
  const targetDir = `./public/media/${file.mimetype.split("/")[0]}`;
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
  fs.writeFileSync(`${targetDir}/${file.originalFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return `${targetDir}/${file.originalFilename}`;
};

export default async function handler(req, res) {
  await connectMongo();
  switch (req.method) {
    case "GET":
      res.status(200).json(await Kowloon.medias(req.query));
      break;
    case "POST":
      let response = {};
      const form = new formidable.IncomingForm({ multiples: true });
      // console.log(form);
      await form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log(err);
          response.err = err;
        }
        console.log(files.media.length);
        const author = fields.userId;
        response.media = [];
        if (files.media.length) {
          await Promise.all(
            files.media.map(async (file) => {
              let filename = await saveFile(file);
              let media = await Media.create({
                author,
                filename,
                type: file.mimetype.split("/")[0],
              });
              response.media.push(media);
            })
          );
        }
        res.status(201).json(response);
      });
      // res.status(200).json(await Kowloon.addMedia(req.body.media));
      // res.status(200).json({ ok: "ok" });

      //   const userq = await Kowloon.user({ username: req.query.username });
      //   const updatedUser = await Kowloon.updateUser(userq.user._id, req.body);
      //   res.status(200).json(updatedUser);

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
