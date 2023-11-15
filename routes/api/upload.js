import Kowloon from "../../kowloon.js";
import formidable from "formidable";
import fs from "fs/promises";
export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  let uploadDir = "public";
  let fullDir, publicDir;
  let re = /(?:\.([^.]+))?$/;
  if (!req.user) {
    response = { error: "Not logged in" };
  } else {
    const form = formidable({ uploadDir: `./${uploadDir}` });
    const [fields, files] = await form.parse(req);
    let filenames = fields["filenames"] || null;
    const destination =
      fields && fields["destination"] ? fields["destination"] : null;
    const uploads = files.uploads || [];
    const returnedFiles = [];
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    if (!fields["destination"]) {
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

      fullDir = `${form.uploadDir}/uploads/${year}/${month}/${day}`;
      publicDir = `/${uploadDir}/uploads/${year}/${month}/${day}`;
    } else {
      try {
        await fs.access(`${form.uploadDir}/${fields["destination"]}`);
      } catch (e) {
        await fs.mkdir(`${form.uploadDir}/${fields["destination"]}`);
      }
      fullDir = `${form.uploadDir}/${fields["destination"]}`;
      publicDir = `/${uploadDir}/${fields["destination"]}`;
    }

    try {
      await Promise.all(
        uploads.map(async (file, i) => {
          let uploadPath = file.filepath;
          let target =
            filenames && filenames[i]
              ? `${fullDir}/${filenames[i]}.${
                  re.exec(file.originalFilename)[1]
                }`
              : `${fullDir}/${req.user._id}-${file.newFilename}-${file.originalFilename}`;
          await fs.rename(uploadPath, target);
          returnedFiles.push({
            href:
              filenames && filenames[i]
                ? `${Kowloon.settings.domain}${publicDir}/${req.user._id}-${file.newFilename}-${file.originalFilename}`
                : `${Kowloon.settings.domain}${publicDir}/${filenames[i]}`,
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
