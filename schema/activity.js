import mongoose from "mongoose";
import Settings from "./settings.js";
import ObjectSchema from "./object.js";
import tensify from "tensify";
import { ObjectId } from "mongoose";
import Circle from "./circle.js";
const vowelRegex = "^[aieouAIEOU].*";
import Kowloon from "../index.js";
import Actor from "./actor.js";

const sanitize = (thing) => {
  if (thing) {
    let newThing = thing;
    for (const [key, value] of Object.entries(newThing)) {
      if (value && value.length == 0) newThing[key] = undefined;
    }
    let fields = ["bto", "bcc", "_id", "_kowloon", "__v", "_owner"];
    fields.forEach((e) => {
      newThing[e] = undefined;
    });
    return newThing;
  }
};

const ActivitySchema = ObjectSchema.clone();

ActivitySchema.add({
  _owner: { type: String, required: true },
  _kowloon: {
    isPublic: { type: Boolean, default: false },
    publicCanComment: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    type: { type: String },
    viewCircles: [String],
    commentCircles: [String],
    delivered: { type: Boolean, default: false },
  },
});

ActivitySchema.pre("save", async function (next) {
  if (this.target && this.target.length > 0) {
    this.target.map((a) => {
      this.to.push(a.id);
    });
  }

  if (this.object && this.object.actor && this.object.actor.id) {
    this.to.push(this.object.actor.id);
  }

  if (this.inReplyTo.length > 0) {
    this.inReplyTo.map((a) => {
      if (a.actor) this.cc.push(a.actor.id);
    });
  }
  if (this.attributedTo.length > 0) {
    this.attributedTo.map((a) => {
      if (a.actor) this.cc.push(a.actor.id);
    });
  }

  if (this._kowloon.viewCircles && this._kowloon.viewCircles.length > 0) {
    try {
      let circles = await Circle.find({ id: this._kowloon.viewCircles });
      let recipients = [];
      circles.map((c) => {
        c.items.map((i) => {
          if (i.active == true) recipients.push(i.subject.id);
        });
      });
      this.bcc = recipients;
    } catch (e) {
      console.log(e);
    }
  }

  this.to = Array.from(new Set(this.to));
  this.bto = Array.from(new Set(this.bto));
  this.cc = Array.from(new Set(this.cc));
  this.bcc = Array.from(new Set(this.bcc));
  next();
});

ActivitySchema.post("save", async function (doc, next) {
  if (!doc.id) {
    let domain = await Settings.findOne({ name: "domain" });
    let username = doc.actor.preferredUsername;
    doc.id = `${domain.value}/@${username}/p/${this._id}`;
    doc.save();
  }
});

ActivitySchema.post("save", async function (doc, next) {
  if (!this.summary) {
    let summary = `${this.actor.name} ${tensify(this.type).past.toLowerCase()}${
      this.object
        ? new RegExp(vowelRegex).test(this.object.type)
          ? " an"
          : " a"
        : ""
    }${this.object ? " " + this.object.type : ""}`;
    this.summary = summary;
  }
  next();
});

ActivitySchema.methods.deliver = async function () {
  if (this.to || this.bto || this.cc || this.bcc) {
    let body = sanitize(this);
    let to = this.to.length > 0 ? this.to : [];
    let bto = this.bto && this.bto.length > 0 ? this.bto : [];
    let cc = this.cc && this.cc.length > 0 ? this.cc : [];
    let bcc = this.bcc && this.bcc.length > 0 ? this.bcc : [];

    let recipients = Array.from(new Set([...to, ...bto, ...cc, ...bcc]));

    recipients = recipients.filter((val) => val != this.actor.id);

    let responses = [];
    if (recipients.length > 0) {
      recipients.map(async (r) => {
        let actor = await Actor.findOne({ id: r });
        let url = actor.inbox ? actor.inbox : actor.id + "/inbox";

        let response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          responses.push(await response.json());
        }
      });
    }
  }
};

ActivitySchema.methods.canView = function (actorId) {
  return this._kowloon.isPublic == true ||
    (this.bcc.length > 0 && this.bcc.indexOf(actorId) != -1)
    ? true
    : false;
};

ActivitySchema.methods.canComment = async function (actorId) {
  let circles = await Circle.find({ id: this._kowloon.commentCircles });

  let commenters = [];
  circles.map((c) => {
    c.items.map((i) => {
      if (i.active == true) commenters.push(i.subject.id);
    });
  });
  return this._kowloon.publicCanComment == true ||
    (commenters.length > 0 && commenters.indexOf(actorId) != -1)
    ? true
    : false;
};

// ActivitySchema.methods.deliver = async function () {
//   try {
//     let body = sanitize(this);
//     let recipients = Array.from(
//       new Set([...this.to, ...this.bto, ...this.cc, ...this.bcc])
//     );
//     recipients = recipients.filter((val) => val != this.owner);

//     responses = [];
//     console.log("Delivering sanitized activity:", body);

//     recipients.map(async (r) => {
//       let url = r.inbox ? r.inbox : r.id + "/inbox";
//       let response = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body,
//       });

//       responses.push(await response.json());
//     });
//     console.log("Outbox responses:", responses);
//   } catch (e) {
//     console.error(e);
//   }
// };

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
