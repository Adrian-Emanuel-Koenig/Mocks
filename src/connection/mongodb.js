import { config } from "dotenv";
import mongoose, { connect } from "mongoose";

config();

mongoose.set("strictQuery", true);

async function connection() {
  try {
    await connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB Atlas"))
      .catch((error) => console.error(error));
  } catch (error) {
    console.log(error);
    throw "can not connect to the db";
  }
}

export const connectionMDB = connection();