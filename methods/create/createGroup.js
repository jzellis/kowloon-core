export default async function (group) {
  try {
    const actor = await this.getActor(group.creator);
    const summary = `${actor.name} created a new Group: ${group.name}`;
    return this.sanitize(
      await this.createActivity({
        type: "Create",
        actor: group.actor,
        object: group,
        objectType: "Group",
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
