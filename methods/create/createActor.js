export default async function (actor) {
  const summary = `${actor.name} joined the server!`;
  return this.sanitize(
    await this.createActivity({
      type: "Create",
      object: actor,
      public: true,
      summary,
    })
  );
}
