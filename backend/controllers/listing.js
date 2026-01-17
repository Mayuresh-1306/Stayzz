const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
   const allListings = await Listing.find({}).populate("owner");
   res.json(allListings);
};

module.exports.renderNewForm = (req, res) => {
   res.json({ message: "Create new listing" });
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
 
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  
  // Set default coordinates if not provided
  if (!newListing.coordinates) {
    newListing.coordinates = {
      latitude: 20.5937,
      longitude: 78.9629
    };
  }
  
  await newListing.save();
  res.status(201).json({ success: true, listing: newListing, message: "New Listing Created!" });
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
};

module.exports.updateListing = async (req, res) => {
   
    let {id} = req.params;

   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
   
   if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   }

   res.json({ success: true, listing: listing, message: "Listing Updated!" });
};

module.exports.destroyListing = async (req, res)=> {
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   res.json({ success: true, message: "Listing Deleted!", listing: deletedListing });
    req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
   };