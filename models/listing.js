const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews.js");

const listingSchema= new Schema({
    title: {
        type:String,
        required:  true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic"]
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing= mongoose.model("listing",listingSchema);
module.exports = Listing;