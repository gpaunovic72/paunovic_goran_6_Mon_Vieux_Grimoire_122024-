const express = require("express");
const auth = require("../middleware/auth");
const { multerConfig, optimizedImg } = require("../middleware/multer-config");

const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, multerConfig, optimizedImg, bookCtrl.createBook);
router.post("/:id/rating",auth, bookCtrl.ratingsBook);
router.put("/:id", auth, multerConfig, optimizedImg, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/bestrating", bookCtrl.bestratingBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getBook);

module.exports = router;
