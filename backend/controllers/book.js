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
        res.status(403).json({ message: new Error("Unauthorized request").message })
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
    res.status(403).json({ message: new Error ("Unauthorized request").message })
  } else {
    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, ()=> {
      Book.deleteOne({_id: req.params.id})
      .then(()=> res.status(200).json({ message: "Livre supprimé !" }))
      .catch((error)=> res.status(401).json({ error }));
    })
  }
 })
 .catch((error) => res.status(500).json({ error }))
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error: "Livre non trouvé" }));
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
      return res.status(404).json({ message: new Error("Le livre n'a pas été trouvé !").message });
    }

    const userId = req.auth.userId;
    const grade = parseFloat(req.body.rating);
  
    const existingRating = book.ratings.find((rating) => rating.userId === userId);
    if(existingRating) {
      return res.status(400).json({ message: new Error("Vous avez déjà noté ce livre !").message });
    }

    book.ratings.push({ userId, grade });
    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    book.averageRating = book.ratings.length > 0 ? totalRatings / book.ratings.length : 0;

    book.save()
    .then((book) => res.status(200).json(book))
    .catch((error) => {
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors);

        const isValidatorError = validationErrors.some((err) => err.name === "ValidatorError");

        if (isValidatorError) {
          return res.status(400).json({
            error: "Erreur de validation",
            details: validationErrors.map((err) => ({
              path: err.path,
              message: err.message,
              value: err.value,
            })),
          });
        }
      }
      res.status(500).json({ error: error.message });
    });
  })
  .catch((error) => res.status(500).json({ error }));
}

exports.bestratingBook = (req, res, next) => {
  Book.find()
  .sort({ averageRating: -1})
  .limit(3)
  .then((topBook) => res.status(200).json(topBook))
  .catch((error) => res.status(500).json({ error }))
}

