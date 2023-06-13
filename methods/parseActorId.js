export default function handler(id) {
  let parsed = id.split("@");
  return { user: parsed[1], domain: parsed[2] };
}
