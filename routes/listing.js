const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwnwer, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,    
    upload.single('listing[image]'), // Handle file upload
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn, 
    isOwnwer, 
    upload.single('listing[image]'), // Handle file upload if image is being updated
    validateListing, 
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn, 
    isOwnwer, 
    wrapAsync(listingController.destroyListing)
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn, 
  isOwnwer, 
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;