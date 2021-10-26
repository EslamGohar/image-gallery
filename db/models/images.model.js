const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imagePath: {
        type: String,
        trim: true,
        //enum: ["img"]
    },
    file: {
        type: String,
        trim: true,
        required: function() { return this.imagePath != ['txt', 'video'] }
    },
    imageUrl: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        minlength: 20,
        maxlength: 600
    },
    // album: [    
    //     { images: {type: String, trim: true} }
    // ]
},
    { timestamps: true }
)


const Album = mongoose.model('Album', albumSchema)
module.exports = Album