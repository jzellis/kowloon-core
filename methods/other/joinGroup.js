export default async function (group, actor) {
  try {
    actor = await this.getActor(actor);
    group = await this.getGroup(group);
    const summary = `${actor.name} joined ${group.name}`;
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
  } catch (error) {
    return { error };
  }
}
