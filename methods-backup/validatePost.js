export default function validatePost(newPost) {
  // Check that the new post has a valid "type" property
  if (!newPost.type || typeof newPost.type !== "string") {
    return false;
  }

  // Check that the new post has a valid "content" property
  if (!newPost.content || typeof newPost.content !== "string") {
    return false;
  }

  // Check that the new post has a valid "published" property
  if (!newPost.published || typeof newPost.published !== "string") {
    return false;
  }

  // Check that the new post has a valid "to" property
  if (!newPost.to || !Array.isArray(newPost.to)) {
    return false;
  }

  // Check that the new post has a valid "cc" property
  if (newPost.cc && !Array.isArray(newPost.cc)) {
    return false;
  }

  // Check that the new post has a valid "object" property
  if (newPost.object && typeof newPost.object !== "object") {
    return false;
  }

  // Check that the new post has a valid "target" property
  if (newPost.target && typeof newPost.target !== "object") {
    return false;
  }

  // If all checks pass, return true
  return true;
}
