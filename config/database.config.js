const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connect succeeded!");
  } catch (error) {
    console.log(error);
    console.log("Connect failed!");
  }
}