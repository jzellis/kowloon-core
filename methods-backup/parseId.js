export default function handler(id) {
  const [username, server] = id.split("@");
  return [username, server];
}
