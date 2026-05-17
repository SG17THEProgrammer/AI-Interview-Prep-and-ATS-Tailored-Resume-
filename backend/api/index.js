const app = require("../src/app");
const connectToDB = require("../src/config/database");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectToDB();
    isConnected = true;
  }

  return app(req, res);
};