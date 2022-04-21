var faker = require("faker")
const mongoose = ("../database")
const express = require("express")
const router = express.Router
const Book = require ("../models.book")

for (let kyskyskys=0; kyskyskys<21; kyskyskys++){
    var bookSchema = new mongoose.Schema({
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        author: faker.name.findName(),
        publishDate: faker.date.recent(),
        image: faker.image.abstract(),
        createdAt: Date.now
    })
    console.log(imageSchema) 
}

// module.exports = mongoose.model("Book, bookSchema")