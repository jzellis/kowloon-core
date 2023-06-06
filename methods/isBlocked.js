export default function handler(user, actor2) {
  return (
    user.actor.blocked.items.indexOf(
      typeof actor2 == "object" && actor2.id ? actor2.id : actor2
    ) != -1
  );
}
