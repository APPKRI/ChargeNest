require("dotenv").config();

const mongoose = require("mongoose");
const Charger = require("./src/models/Charger");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

    await Charger.deleteMany({});

    await Charger.insertMany([

        {

            name:"GreenVolt Hub",

            latitude:27.988,

            longitude:76.381,

            power:120,

            price:18,

            type:"CCS2",

            status:"Available"

        },


        {

            name:"Neemrana EV",

            latitude:27.993,

            longitude:76.404,

            power:60,

            price:15,

            type:"CCS2",

            status:"Available"

        },



        {

            name:"Manesar FastCharge",

            latitude:28.353,

            longitude:76.942,

            power:180,

            price:20,

            type:"CCS2",

            status:"Available"

        }

    ]);


    console.log("Chargers Seeded");


    process.exit();

})
.catch(err=>{

    console.log(err);

});