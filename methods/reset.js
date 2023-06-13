import { Activity, User, Inbox, Outbox } from "../schema/index.js";
import { faker } from "@faker-js/faker";
export default async function handler(options) {
  // this.parseActorId("@jzellis@localhost:3000");
  await Activity.deleteMany({});
  await User.deleteMany({ username: { $ne: "jzellis" } });
  await Inbox.deleteMany({});
  await Outbox.deleteMany({});

  // let username = "jzellis",
  //   password = "Turing9981!",
  //   name = "Joshua Ellis",
  //   email = "jzellis@gmail.com",
  //   summary = "Writer, musician, creator of Kowloon",
  //   location = "Watford, UK",
  //   urls = ["https://www.zenarchery.com", "https://kwln.social"];

  // return await this.createUser({
  //   username,
  //   password,
  //   name,
  //   email,
  //   summary,
  //   location,
  //   urls,
  // });

  return true;
}
