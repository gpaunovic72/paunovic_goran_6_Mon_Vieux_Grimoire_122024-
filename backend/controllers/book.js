const Book = require("../models/Book");
const fs =require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    title: bookObject.title,
    author: bookObject.author,
    year: bookObject.year,
    genre: bookObject.genre,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book.save()
    .then(() => res.status(201).json({ message: "Livre ajouté !" }))
    .catch((error) => res.status(403).json({ error: "Unauthorized request" }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    Book.findOne({_id: req.params.id})
    .then((book)=> {
      if(book.userId != req.auth.userId) {
        res.status(403).json(new Error("Unauthorized request"))
      } else {
        Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
        .then(()=> res.status(200).json({message: "Livre modifié !"}))
        .catch((error)=> res.status(400).json({ error }));
      }
    })
    .catch((error)=> res.status(400).json({ error }))
};

exports.deleteBook = (req, res, next) => {
 Book.findOne({ _id:req.params.id})
 .then(book => {
  if(book.userId != req.auth.userId) {
    res.status(403).json(new Error ("Unauthorized request"))
  } else {
    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, ()=> {
      Book.deleteOne({_id: req.params.id})
      .then(()=> res.status(200).json({message: "Livre supprimé !"}))
      .catch((error)=> res.status(401).json({ error }));
    })
  }
 })
 .catch((error) => res.status(500).json({ error }))
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.ratingsBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => {
    if(!book) {
      return res.status(404).json(new Error("Le livre n'a pas été trouvé !"));
    }

    const userId = req.auth.userId;
    const grade = parseFloat(req.body.rating);
  
    if(!Number.isInteger(grade) || grade < 0 || grade > 5) {
      res.status(400).json(new Error("La note doit être un nombre entier compris entre 0 et 5 !"));
    }

    const existingRating = book.ratings.find((rating) => rating.userId === userId);
    if(existingRating) {
      return res.status(400).json(new Error("Vous avez déjà noté ce livre !"));
    }

    book.ratings.push({ userId, grade });

    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    book.save()
    .then((book) => res.status(200).json(book))
    .catch((error) => 
      res.status(500).json({ error }));
  })
  .catch((error) => res.status(500).json({ error }));
}

