const mongoose = require("mongoose");

const chargerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    latitude:{
        type:Number,
        required:true
    },

    longitude:{
        type:Number,
        required:true
    },

    power:{
        type:Number,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    type:{
        type:String,
        default:"CCS2"
    },

    status:{
        type:String,
        enum:["Available","Booked","Occupied","Maintenance","Not Available"],
        default:"Available"
    },

    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    rating:{
        type:Number,
        default:0
    },

    reviewCount:{
        type:Number,
        default:0
    },

    reviews:[{
        bookingId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking"
        },
        driverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            required:true
        },
        feedback:{
            type:String,
            trim:true,
            maxlength:800
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],

    availableSlots:{
        type:[String],
        default:[
            "08:00 AM - 09:00 AM",
            "09:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "12:00 PM - 01:00 PM",
            "01:05 PM - 02:00 PM",
            "02:00 PM - 03:00 PM",
            "03:00 PM - 04:00 PM",
            "04:00 PM - 05:00 PM",
            "05:00 PM - 06:00 PM",
            "06:00 PM - 07:00 PM",
            "07:00 PM - 08:00 PM"
        ]
    }

},{
    timestamps:true
});


module.exports = mongoose.model(

"Charger",

chargerSchema

);
