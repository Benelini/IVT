const express = require("express")
const router = express.Router()
const Book = require("../models/book")
const Author = require("../models/author")
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"]



//Filtr knih
router.get("/", async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.title != "") {
    query = query.gte("publishDate", req.query.publishedAfter)
  }
  try{const books = await query.exec()
    res.render("books/index", {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect("/")
  }
})


router.get("/new", async (req, res) => {
  renderNewPage(res, new Book())
})


router.post("/", async (req, res) => {
  const book = new Book ({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
  } catch {
    renderNewPage(res, book, true)
  }
})

router.get("/:id", async(req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    .populate(author)
    .exec()
    res.render("books/show", { book: book})
  } catch {
    res.redirect("/")
  }
})

router.delete("/:id", async(req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect("/books")
  } catch {
    if (book != null ) {
      res.render("books/show", {
        book: book,
        errorMessage: "Nelze odstranit knihu"
      })
    } else {
      res.redirect("/")
    }
  }
})

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError)
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "Edit", hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Nelze upravit knihu"
      } else {
        params.errorMessage = "Nelze vytvořit knihu"
      }
    }
    res.render(`books/${form}`, params)
  } catch {
    res.redirect("/books")
  }
} 

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base")
    book.coverImageType = cover.type
  }
} 
module.exports = router