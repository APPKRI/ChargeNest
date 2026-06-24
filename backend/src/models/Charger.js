const mongoose = require("mongoose");


const chargerSchema = new mongoose.Schema({

name:String,


location:{

type:{
type:String,
default:"Point"
},

coordinates:[Number]

},


price:Number


});


chargerSchema.index({

location:"2dsphere"

});


module.exports = mongoose.model(

"Charger",

chargerSchema

);