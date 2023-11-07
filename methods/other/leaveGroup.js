export default async function (group, actor) {
  actor = await this.getActor(actor);
  group = await this.getGroup(group);
  const summary = `${actor.name} joined ${group.name}`;
  return this.sanitize(
    await this.createActivity({
      type: "Create",
      actor: group.actor,
      object: group,
      public: false,
      to: [actor.id],
      cc: [],
      bto: [],
      bcc: group.admins,
      summary,
    })
  );
}
