if(process.env.NODE_ENV != "production"){
    require("dotenv").config({path: '../.env'});
}

const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const dbUrl= process.env.ALTASDB_URL
console.log(dbUrl)
main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(dbUrl);
}
const initDB=  async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner: "68f5fe9abd41663bdca73dae" }))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();