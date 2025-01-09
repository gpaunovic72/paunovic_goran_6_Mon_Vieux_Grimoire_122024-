const mongoose = require("mongoose");
const validator = require("validator");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  userId: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { 
        type: Number, min: 0, max: 5, 
        required: true,
        validate: {
          validator: Number.isInteger,
          message: "La note doit être un nombre entier",
        },
      },
      
    }
  ],
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
