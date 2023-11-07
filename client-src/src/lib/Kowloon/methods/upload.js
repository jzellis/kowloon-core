export default async function (uploads) {
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
}
