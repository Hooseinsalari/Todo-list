const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return false;
    }

    await mongoose.connect("mongodb://0.0.0.0:27017/next-auth");
    console.log("Connect to db has successfully");
  } catch (error) {
    console.log("Connect to db has failed, Error =>", error);
  }
};

export default connectToDB;
