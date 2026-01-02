require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

mongoose.connect(process.env.MONGO_URL);

const fixListings = async () => {
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.coordinates": { $size: 0 } }
    ]
  });

  console.log(`Found ${listings.length} listings to fix`);

  for (let listing of listings) {
    try {
      const query = `${listing.location}, ${listing.country}`;
      const geometry = await geocode(query);

      if (!geometry) {
        console.log(`❌ Failed for ${listing.title}`);
        continue;
      }

      listing.geometry = geometry;
      await listing.save();

      console.log(`✅ Fixed: ${listing.title}`);
    } catch (err) {
      console.log(`🔥 Error for ${listing.title}`, err.message);
    }
  }

  mongoose.connection.close();
};

fixListings();
