export default async function (actor) {
  try {
    const summary = `${actor.name} joined the server!`;
    return this.sanitize(
      await this.createActivity({
        type: "Create",
        object: actor,
        public: true,
        summary,
      })
    );
  } catch (error) {
    return { error };
  }
}
