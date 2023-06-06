import mongoose from "mongoose";
export default async function handler() {
  mongoose.connection.close();
  console.log("Connection closed");
}
