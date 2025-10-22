const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const listing= require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js");
const {storage}= require("../cloudConfig.js");
const listingController= require("../controllers/listing.js");

const multer= require("multer");
const upload= multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));
    
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//search route
router.get("/search",listingController.searchListing);

//filter route
router.get("/option", async (req, res) => {
  const category = req.query.category; // extract category value from query

  let allListings;
  if (category) {
    allListings = await listing.find({ category }); // filter by category
  } else {
    allListings = await listing.find({}); // show all if no category selected
  }

  res.render("listings/index.ejs", { allListings });
});



router 
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync (listingController.updateListing))
    .delete(isOwner, wrapAsync(listingController.destroyListing));



//edit route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync (listingController.renderEditForm));



module.exports = router;