const sanitizedFields = [
  "bto",
  "bcc",
  "password",
  "privateKey",
  "lastTimelineUpdate",
  "circles",
  "blocked",
  "_id",
  "__v",
  "user",
];

const sanitizeObject = (object) => {
  if (typeof object === "string") return object;
  if (typeof object === "array") {
    object.map((o) => sanitizeObject(o));
  }
  if (
    typeof object === "object" &&
    object !== null &&
    object.constructor === Object
  ) {
    Object.keys(object).map((key) => {
      if (sanitizedFields.includes(key)) {
        delete object[key];
      }
      if (typeof object[key] === "object") {
        sanitizeObject(object[key]);
      }
    });
  }
  return object;
};

export default function handler(object) {
  return sanitizeObject(object);
}
