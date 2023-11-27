import store from "../store/index.js";
const user = store.getState().user.user;

const Kowloon = {
  endpoint: import.meta.env.VITE_API_ENDPOINT,
  settings: null,
  init: async function () {
    this.settings = await this.get("/");
  },
  get: async function (url) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (store.getState().user.user.accessToken)
      headers.Authorization =
        "Bearer : " + store.getState().user.user.accessToken;
    return await (
      await fetch(`${this.endpoint}${url}`, {
        headers,
      })
    ).json();
  },

  post: async function (url, body) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (store.getState().user.user.accessToken)
      headers.Authorization =
        "Bearer : " + store.getState().user.user.accessToken;
    return await (
      await fetch(`${this.endpoint}${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
    ).json();
  },

  login: async function (username, password) {
    const response = await fetch(`${this.endpoint}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(username, password),
    });
    const data = await response.json();
    return data;
  },
  auth: async function (token) {
    const response = await fetch(`${this.endpoint}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  },
};

await Kowloon.init();
export default Kowloon;
