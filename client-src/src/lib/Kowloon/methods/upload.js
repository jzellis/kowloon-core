export default async function (uploads, destination, filenames) {
  const formData = new FormData();
  for (let i = 0; i < uploads.length; i++) {
    formData.append("uploads", uploads[i]);
  }
  if (destination) formData.append("destination", destination);
  if (filenames) {
    for (let i = 0; i < filenames.length; i++) {
      formData.append("filenames", filenames[i]);
    }
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
