const activityTypes = [
  "Accept",
  "Add",
  "Announce",
  "Arrive",
  "Block",
  "Create",
  "Delete",
  "Dislike",
  "Flag",
  "Follow",
  "Ignore",
  "Invite",
  "Join",
  "Leave",
  "Like",
  "Listen",
  "Move",
  "Offer",
  "Question",
  "Reject",
  "Read",
  "Remove",
  "TentativeReject",
  "TentativeAccept",
  "Travel",
  "Undo",
  "Update",
  "View",
];

const actorTypes = [
  "Application",
  "Group",
  "Organization",
  "Person",
  "Service",
];

const postTypes = [
  "Article",
  "Audio",
  "Document",
  "Event",
  "Image",
  "Note",
  "Post",
  "Link",
  "Media",
  "Page",
  "Place",
  "Profile",
  "Relationship",
  "Tombstone",
  "Video",
];

export default function handler(object) {
  if (!object.type) return false;

  switch (true) {
    case activityTypes.includes(object.type):
      return "activity";
      break;
    case actorTypes.includes(object.type):
      return "actor";
      break;
    case postTypes.includes(object.type):
      return "post";
      break;
  }
}
