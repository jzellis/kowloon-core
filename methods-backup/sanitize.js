const sanitizedFields = [
  "bto",
  "bcc",
  "password",
  "privateKey",
  "_id",
  "__v",
  "user",
];

const sanitizeObject = (object) => {
  Object.keys(object).map((key) => {
    if (sanitizedFields.includes(key)) {
      delete object[key];
    }
    if (typeof object[key] === "object") {
      sanitizeObject(object[key]);
    }
  });
};

export default function handler(object) {
  return sanitizeObject(object);
}
