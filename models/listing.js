const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    } ,
    description: String,
    image: {
      url: String,
      filename: String,
    },

//   type: String,
//   default: "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/33/f7/49/e7/33/v1_E10/E10AK4Y4.jpg?w=1400&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=4cd4a68be7821942418a1a4986e6af7d5735d7926934afb2c7585b2400107f8d",
//   set: (v) =>
//     v === ""
//       ? "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/33/f7/49/e7/33/v1_E10/E10AK4Y4.jpg?w=1400&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=4cd4a68be7821942418a1a4986e6af7d5735d7926934afb2c7585b2400107f8d"
//       : v
// },

    
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
  await Review.deleteMany({ _id: {$in: listing.reviews } });
  }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;