/**
 * @namespace kowloon
 */

function sanitizeObject(obj, additionalFields = [], allowedFields = []) {
  let sanitizedFields = [
    "bto",
    "bcc",
    "password",
    "privateKey",
    "lastTimelineUpdate",
    "circles",
    "blocked",
    "groups",
    "bookmarked",
    "liked",
    // "_id",
    "__v",
    "user",
    "prefs",
  ];
  sanitizedFields = [...sanitizedFields, ...additionalFields];
  if (allowedFields.length > 0)
    sanitizedFields = sanitizedFields.filter(
      (el) => allowedFields.indexOf(el) === -1
    );
  if (typeof obj !== "object" || obj === null) {
    // Base case: if the current value is not an object, or is null, return it as is
    return obj;
  }

  // Create a new object to store the sanitized data
  const sanitizedObj = Array.isArray(obj) ? [] : {};

  // Recursively sanitize each key-value pair in the object
  for (const key in obj) {
    if (typeof obj === "object" && Object(obj).hasOwnProperty(key)) {
      // Check if the key is not in the list of prohibited keys
      if (!sanitizedFields.includes(key)) {
        // Recursively sanitize the nested object
        sanitizedObj[key] = sanitizeObject(
          obj[key],
          additionalFields,
          allowedFields
        );
      }
      // If the key is in the list of prohibited keys, skip it
    }
  }

  return sanitizedObj;
}

export default function handler(object, additionalFields, allowedFields) {
  try {
    // Which fields are sanitized is stored in the primary Kowloon object
    // return object;
    // return sanitizeObject(object);

    return sanitizeObject(
      object._doc ? object._doc : object,
      additionalFields,
      allowedFields
    );
  } catch (e) {}
}
