import Kowloon from "../../kowloon.js";
import formidable from "formidable";
import fs from "fs/promises";
export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (!req.user) {
    response = { error: "Not logged in" };
  } else {
    const form = formidable({ uploadDir: "./public/uploads" });

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    try {
      await fs.access(`${form.uploadDir}/${year}`);
    } catch (e) {
      await fs.mkdir(`${form.uploadDir}/${year}`);
    }

    try {
      await fs.access(`${form.uploadDir}/${year}/${month}`);
    } catch (e) {
      await fs.mkdir(`${form.uploadDir}/${year}/${month}`);
    }

    try {
      await fs.access(`${form.uploadDir}/${year}/${month}/${day}`);
    } catch (e) {
      await fs.mkdir(`${form.uploadDir}/${year}/${month}/${day}`);
    }

    // if (!(await fs.access(`${form.uploadDir}/${year}`))) {
    //   await fs.mkdir(`${form.uploadDir}/${year}`);
    // }

    // if (!(await fs.access(`${form.uploadDir}/${year}/${month}`))) {
    //   await fs.mkdir(`${form.uploadDir}/${year}/${month}`);
    // }

    // if (!(await fs.access(`${form.uploadDir}/${year}/${month}/${day}`))) {
    //   await fs.mkdir(`${form.uploadDir}/${year}/${month}/${day}`);
    // }

    const fullDir = `${form.uploadDir}/${year}/${month}/${day}`;
    const publicDir = `/public/uploads/${year}/${month}/${day}`;

    try {
      const [fields, files] = await form.parse(req);
      const uploads = files.uploads || [];
      const returnedFiles = [];

      await Promise.all(
        uploads.map(async (file) => {
          let uploadPath = file.filepath;
          let target = `${fullDir}/${req.user._id}-${file.newFilename}-${file.originalFilename}`;
          await fs.rename(uploadPath, target);
          returnedFiles.push({
            href: `${Kowloon.settings.domain}${publicDir}/${req.user._id}-${file.newFilename}-${file.originalFilename}`,
            type: file.mimetype,
          });
        })
      );
      response = returnedFiles;
    } catch (e) {
      status = 500;
      response = { error: e };
    }
  }
  res.status(status).json(response);
}
