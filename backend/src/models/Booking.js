const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    driverId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    chargerId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Charger",

        required: true

    },

    hostId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },


    date: {

        type: String,

        required: true

    },


    time: {

        type: String,

        required: true

    },

    price: {

        type: Number,

        required: true

    },

    energyKwh: {

        type: Number,

        default: 45

    },

    totalAmount: {

        type: Number,

        required: true

    },


    status: {

        type: String,

        enum: [

            "Pending",

            "Confirmed",

            "Completed",

            "Cancelled"

        ],

        default: "Pending"

    },

    review: {

        rating: {

            type: Number,

            min: 1,

            max: 5

        },

        feedback: {

            type: String,

            trim: true,

            maxlength: 800

        },

        createdAt: Date

    }

},{

    timestamps:true

});


module.exports = mongoose.model(

"Booking",

bookingSchema

);
