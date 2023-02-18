const settings = {
  name: "My Kowloon",
  url: "http://localhost.com:3000",
  description:
    "This is my first Kowloon. In fact, it's the first Kowloon ever.",
};

const defaultPostTypes = [
  {
    name: "Status",
    value: "status",
    description: "A short status or update post, like a tweet.",
  },
  {
    name: "Post",
    value: "post",
    description: "A longer post, with an optional title.",
  },
  {
    name: "Media",
    value: "media",
    description: "An image, audio or video.",
  },
  {
    name: "Link",
    value: "link",
    description: "A link with a title and description.",
  },
];

export { settings, defaultPostTypes };
