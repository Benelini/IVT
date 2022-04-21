const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String

    },

    description: {
        required: true,
        type: String
    },

    publishDate: {
        required: true,
        type: Date
    },

    pageCount: {
        required: true,
        type: Number
        
    },

    createdAt: {
        required: true,
        type: Date,
        default: Date.now
    },

    coverImageName: {
        required: true,
        type: String
    },

    coverImage: {
        required: true,
        type: Buffer
    },

    coverImageType: {
        required: true,
        type: String
    },

    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
    },
})

bookSchema.virtual("coverImagePath").get(function() {
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType}; charset=utf-8; base64,${this.coverImage.toString("base64")}`
    }
})

module.exports = mongoose.model("Book", bookSchema)