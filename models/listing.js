const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  };
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
