const express= require("express");
const app= express();
const mongoose= require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js")



main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.listen(8080, ()=>{
    console.log("server is listening at port 8080");
});

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.get("/",(req,res)=>{
    res.send("I am there");
});
//index route
app.get("/listings",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
//new route
app.get("/listings/new", async (req,res)=>{
    res.render("listings/new.ejs");
})
//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
//create route
app.post("/listings",wrapAsync(async (req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
}))
//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update route
app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})

//Delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title: "Home",
//         description: "welcome home",
//         price: 2100,
//         location: "kestopur",
//         Country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successful testing");
// }

app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})