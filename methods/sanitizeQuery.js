export default function handler(q) {
  let $or =
    !this.actor || !this.actor.id
      ? [{ "_kowloon.isPublic": true }]
      : [
          { "_kowloon.isPublic": true },
          { to: this.actor.id },
          { bto: this.actor.id },
          { cc: this.actor.id },
          { bcc: this.actor.id },
        ];
  return {
    ...q,
    $or,
    deleted: { $exists: false },
  };
}
