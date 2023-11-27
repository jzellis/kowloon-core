const isValidActivityStreamsActorID = function (actorID) {
  // Actor ID format: "@username@domain"
  const actorIDRegex = /^@([a-zA-Z0-9_-]+)@([a-z0-9.-]+)$/;

  return actorIDRegex.test(actorID);
};

export default function (actor) {
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
    case actor.type && !validTypes.includes(actor.type):
      errors.push("Actor has invalid type");
    case !actor.username:
      errors.push("Actor has no username");
    case !actor.name:
      errors.push("Actor has no name");
    case actor.id && !isValidActivityStreamsActorID(actor.id):
      errors.push("Actor id is invalid");
    case typeof actor.actor != "string":
      errors.push("Actor actor must be an ID string");
    case actor.target && typeof actor.target != "string":
      errors.push("Actor target must be an ID string");
      break;
  }
  return errors.length > 0 ? errors : true;
}
