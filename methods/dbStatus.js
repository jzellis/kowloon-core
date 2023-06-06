import mongoose from "mongoose";
export default async function handler(options) {
  return mongoose.connections[0].readyState;
}
