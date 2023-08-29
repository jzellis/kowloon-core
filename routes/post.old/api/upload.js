import Kowloon from "../../../kowloon/index.js";
import fs from "fs";
import util from "util";
import multer from "multer";
import path from "path";
const upload = multer({ dest: Kowloon.settings.uploadDir });

function slugify(str) {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}

export default async function handler(req, res, next) {
  let status = 200;
  let response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Collection",
    items: [],
  };

  upload.array("files")(req, res, async () => {
    const uploadPath = path.resolve(Kowloon.settings.uploadDir);
    const files = req.files;
    await Promise.all(
      files.map(async (f) => {
        const type =
          f.mimetype.split("/")[0].charAt(0).toUpperCase() +
          f.mimetype.split("/")[0].slice(1);
        const slugged = `${slugify(
          f.originalname.split(".").slice(0, -1).join(".")
        )}.${f.originalname.split(".").pop()}`;
        fs.renameSync(f.path, `${uploadPath}/${slugged}`);
        const newAttachment = {
          type:
            f.mimetype.split("/")[0].charAt(0).toUpperCase() +
            f.mimetype.split("/")[0].slice(1),
          mimeType: f.mimetype,
          name: f.originalname,
          url: `${Kowloon.settings.domain}/${Kowloon.settings.uploadDir
            .split("/")
            .splice(1)
            .join("/")}/${slugged}`,
        };
        response.items.push(newAttachment);
      })
    );
    response.totalItems = response.items.length;
    res.status(status).json(response);
  });
  // const upload = multer("./public/uploads");
}
