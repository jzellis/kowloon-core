export default async function (group) {
  const actor = await this.getActor(group.actor);
  const summary = `${actor.name} created a new Group: ${group.name}`;
  return this.sanitize(
    await this.createActivity({
      type: "Create",
      actor: group.actor,
      object: group,
      public: group.public,
      to: group.to,
      cc: group.cc,
      bto: group.bto,
      bcc: group.bcc,
      summary,
    })
  );
}
