export default async function handler(id, options) {
  options = { ...options, method: "GET" };
  try {
    let response = await fetch(id, options);
    return await response.json();
  } catch (e) {
    console.error(e);
    return false;
  }
}
