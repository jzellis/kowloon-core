export default function (post) {
  let errors = [];
  let validTypes = [
    "Application",
    "Group",
    "Organization",
    "Person",
    "Service",
    "Server",
    "Feed",
  ];
  switch (true) {
    case !post.type:
      errors.push("Post has no type");
    case !post.actor:
      errors.push("Post has no actor");
    case !post.source?.content:
      errors.push("Post has no content");
      break;
  }
  return errors.length > 0 ? errors : true;
}
