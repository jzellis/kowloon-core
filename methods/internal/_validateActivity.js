export default function (activity) {
  let errors = [];
  let validTypes = [
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
    "Unlike",
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

  switch (true) {
    case !activity.type:
      errors.push("Activity has no type");
    case ["Create", "Update"].includes(activity.type) && !activity.objectType:
      errors.push("Create and Update activities require an object type");
    case !validTypes.includes(activity.type):
      errors.push("Activity has invalid type");
    case !activity.actor:
      errors.push("Activity has no actor");
    case typeof activity.actor != "string":
      errors.push("Activity actor must be an ID string");
    case activity.target && typeof activity.target != "string":
      errors.push("Activity target must be an ID string");
      break;
  }
  return errors.length > 0 ? errors : true;
}
