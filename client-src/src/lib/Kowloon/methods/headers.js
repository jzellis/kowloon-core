export default function handler() {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (this.user) headers.Authorization = `Bearer ${this.user.accessToken}`;
  return headers;
}
