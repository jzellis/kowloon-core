import { User, Media } from "../../models";
import sanitizeHtml from "sanitize-html";
import slugify from "../../utils/slugify";

/**
 *
 * @param {object} search - Search criteria
 * @param {object} options - Options object
 * @returns {object}
 */
const media = async function (search, fields) {
  search = search || {};
  fields = fields || {};
  search.deleted = false;
  fields.deleted = 0;
  const response = {};
  response.media = await Media.findOne(search, fields).populate({
    path: "author",
    select: "username _id",
  });
  return JSON.parse(JSON.stringify(response));
};

/**
 *
 * @param {object*} search
 * @param {*} options
 * @param {*} limit
 * @param {*} offset
 * @returns
 */

const medias = async function (search, fields, options) {
  search = search || {};
  fields = fields || {};
  options = options || {};
  search.deleted = false;
  fields.deleted = 0;
  options.limit = 0;
  options.offset = 0;
  const response = {};
  let medias = await Media.find(search, fields)
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "username _id",
    });
  response.medias = medias;

  return JSON.parse(JSON.stringify(response));
};

const addMedia = async (data) => {
  let media = data;
  console.log("Sent data", media);
  let response = {};

  try {
    response.media = await Media.create(media);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

const updateMedia = async (mediaId, fields) => {
  let response = {};
  try {
    response.media = await Media.findByIdAndUpdate(mediaId, fields);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

export { media, medias, addMedia, updateMedia };
