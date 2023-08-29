const sanitizedFields = [
  "bto",
  "bcc",
  "password",
  "privateKey",
  "_id",
  "__v",
  "user",
];

export default function handler(object) {
  sanitizedFields.map((f) => {
    if (object.f) object.f = undefined;
  });
  return object;
}
