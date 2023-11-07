export default async function (url, activity) {
  return await this.post(
    `${import.meta.env.VITE_API_SERVER}/users/${
      this.user.actor.preferredUsername
    }/outbox`,
    { activity }
  );
}
