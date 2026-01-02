const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const {upload} = require("../cloudConfig.js");

const listingController = require("../controllers/listings.js");

router
    .route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(isLoggedIn, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.createListing));
    // .post(upload.single('listing[image][url]'), function (req, res, next) {
    //     res.send(req.file);
    // });

//New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.get("/search", listingController.searchListings);

router
    .route("/:id")
    //Show Route
    .get(wrapAsync(listingController.showListing))
    //Update Route
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get('/:id/edit', isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;