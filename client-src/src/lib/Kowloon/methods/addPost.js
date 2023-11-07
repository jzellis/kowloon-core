export default async function (post) {
  return await this.post(
    `${import.meta.env.VITE_API_SERVER}/users/${
      this.user.actor.preferredUsername
    }/outbox`,
    { post }
  );
}
