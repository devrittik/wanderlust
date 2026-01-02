const cloudinary = require("cloudinary").v2;
const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you've requested doesn't exist!");
        return res.redirect("/listings");
    };
    console.log(listing);
    res.render('listings/show', { listing });
};

module.exports.createListing = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Image upload is required");
    return res.redirect("/listings/new");
  }

  const { location, country } = req.body.listing;

  const geometry = await geocode(`${location}, ${country}`);
  console.log("GEOMETRY 👉", geometry);

  if (!geometry) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }

  const listing = new Listing(req.body.listing);

  listing.geometry = geometry;
  listing.owner = req.user._id;

  listing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await listing.save();
  console.log("SAVED LISTING 👉", listing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you've requested doesn't exist!");
        return res.redirect("/listings");
    };
    res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    listing.set(req.body.listing);

    if (req.file) {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        };

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    };

    await listing.save();

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect(`/listings`);
};

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
    ],
  });

  res.render("listings/index", { allListings: listings });
};
