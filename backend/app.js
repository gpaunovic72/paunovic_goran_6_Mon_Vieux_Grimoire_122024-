const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://gpaunovic8:ooRlv6bqkqTa0inz@cluster0.j8j75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "Objet créé !" });
});

app.get("/api/books", (req, res) => {
  const books = [
    {
      id: "1",
      userId: "clc4wj5lh3gyi0ak4eq4n8syr",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl:
        "https://s3-alpha-sig.figma.com/img/5ccc/4259/8557d1328035a059629ef24ada741e6b?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pB1sWfy5eKOnQRnaNLjmtf8QYc1XyFrP0xOUV-YDHilNOrLeGza1Ti-VtME0~zc3J0au6xUUzjGNFyjNgFUs1fnK57XQAptush0erTYNvX4bwmEL8FhiMBRpaUq3RDSpDDfRycqjTDmWnhvid96MtSH~Hk~z5TARy03L3nf4nrM10xsHDkzHhOHaAOuz60ROc-t~0k1JdY1Zx-O~LXUZmHkygCt0XXOuL5AFClXbLJb4MmysJ7pIl5Px84BE7WPENefJDlzr-MQJgmTSKxNj8-81BPawqBRj3UaUPvoICsGc9KfzSWyPwY853mTbL8uTcGdGvk1WrNyJfLE2ixtP0w__",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
