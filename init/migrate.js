require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

mongoose.connect(process.env.MONGO_URL);

(async () => {
  const listings = await Listing.find({ geometry: { $exists: false } });

  for (let l of listings) {
    const geo = await geocode(`${l.location}, ${l.country}`);
    if (geo) {
      l.geometry = geo;
      await l.save();
      console.log("Updated:", l.title);
    }
  }

  console.log("DONE");
  mongoose.connection.close();
})();
