export default async function (circle) {
  try {
    const actor = await this.getActor(circle.actor);
    const summary = `${actor.name} created a new Circle: ${circle.name}`;
    return this.sanitize(
      await this.createActivity({
        type: "Create",
        actor: circle.actor,
        object: circle,
        objectType: "Circle",
        public: circle.public,
        to: circle.to,
        cc: circle.cc,
        bto: circle.bto,
        bcc: circle.bcc,
        summary,
      })
    );
  } catch (error) {
    return { error };
  }
}
