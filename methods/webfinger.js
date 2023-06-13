export default function handler(id) {
  let parsed = id.split("@");
  return `${parsed[2]}/.well-known/webfinger?resource=acct:${id}`;
}
