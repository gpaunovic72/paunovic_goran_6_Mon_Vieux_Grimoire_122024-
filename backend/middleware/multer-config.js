const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPE[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const multerConfig = multer({ storage }).single("image");

const optimizedImg = async (req, res, next) => {
  if(!req.file) {
    return next();
  }

  const inputPath = req.file.path;
  const outputFilename = `${req.file.filename.split(".")[0]}.webp`;
  const outputPath = path.join("images", outputFilename);
  
  try{
    await sharp(inputPath)
    .webp({quality: 95})
    .toFile(outputPath);

    fs.unlinkSync(inputPath);

    req.file.filename = outputFilename;
    req.file.path = outputPath;

    next();
  } catch(error){
    return res.status(500).json({error: "Erreur lors de l'optimisation de l'image !"})
  }
}

module.exports = { multerConfig, optimizedImg };