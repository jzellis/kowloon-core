export default function handler(q) {
  let $or = [
    { to: this.user.id },
    { bto: this.user.id },
    { cc: this.user.id },
    { bcc: this.user.id },
  ];
  return {
    ...q,
    $or,
    deleted: { $exists: false },
  };
}
