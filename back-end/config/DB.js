require("dotenv").config();
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  const url = process.env.URL;

  await mongoose.connect(url);
  try {
    console.log("data conected succuflly");
  } catch (error) {
    console.log("error->", error);
  }
}
