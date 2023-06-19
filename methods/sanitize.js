export default function handler(a) {
  if (a) {
    let newObj = a._doc ? a._doc : a;
    for (const [key, value] of Object.entries(newObj)) {
      if (value && value.length == 0)
        // delete newObj[key];
        newObj[key] = undefined;
    }
    let fields = [
      "owner",
      "blocked",
      "circles",
      "userId",
      "user",
      "_id",
      "bto",
      "bcc",
      "_kowloon",
      "__v",
    ];
    fields.forEach((e) => {
      newObj[e] = undefined;
    });
    if (a.prefs && a.prefs.publicFollowers && a.prefs.publicFollowers == false)
      a.followers = undefined;
    if (a.prefs && a.prefs.publicFollowers && a.prefs.publicFollowing == false)
      a.following = undefined;
    return newObj;
  }
}
