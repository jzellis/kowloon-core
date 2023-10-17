const kowloon = {
  user: JSON.parse(localStorage.getItem("user")),
  headers: function () {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.user) headers.authorization = `Bearer ${this.user.accessToken}`;
    return headers;
  },

  login: async function (username, password) {
    return await (
      await fetch(`${import.meta.env.VITE_API_SERVER}/login`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ username, password }),
      })
    ).json();
  },
  get: async function (url) {
    return await (
      await fetch(url, {
        headers: this.headers(),
      })
    ).json();
  },

  post: async function (url, body) {
    return await (
      await fetch(url, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(body),
      })
    ).json();
  },

  getSettings: async function () {
    return await this.get(`${import.meta.env.VITE_API_SERVER}`);
  },
  getPublicTimeline: async function (page = 1) {
    return await this.get(`${import.meta.env.VITE_API_SERVER}/outbox`);
  },

  upload: async function (uploads) {
    const formData = new FormData();
    for (let i = 0; i < uploads.length; i++) {
      formData.append("uploads", uploads[i]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/upload`, {
        method: "POST",
        headers: {
          authorization: this.user ? `Bearer ${this.user.accessToken}` : "",
          // "content-type": "application/x-www-form-urlencoded", // "multipart/form-data
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();
      return data;
    } catch (e) {
      return { error: e };
    }
  },
  getLinkPreview: async function (url) {
    return await this.get(
      `${import.meta.env.VITE_API_SERVER}/preview?url=${url}`
    );
  },
  addPost: async function (post) {
    return await this.post(
      `${import.meta.env.VITE_API_SERVER}/users/${
        this.user.actor.preferredUsername
      }/outbox`,
      post
    );
  },
};

const Kowloon = kowloon;
export default Kowloon;
