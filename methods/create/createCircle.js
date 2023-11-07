export default async function (circle) {
  const actor = await this.getActor(circle.actor);
  const summary = `${actor.name} created a new Circle: ${circle.name}`;
  return this.sanitize(
    await this.createActivity({
      type: "Create",
      actor: circle.actor,
      object: circle,
      public: circle.public,
      to: circle.to,
      cc: circle.cc,
      bto: circle.bto,
      bcc: circle.bcc,
      summary,
    })
  );
}
