export default function hash(str) {
  str = str || "";
  let hash = "";
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i).toString(16);
  return hash;
}
