const express = require("express");

const { authProtectMiddleware } = require("../middleware/authProtectMiddleware");
const { createComment, getCommentsByProduct ,deleteComment, getProductRating } = require("../controllers/CommentController");


const router = express.Router();


router.post("/", authProtectMiddleware, createComment);
router.delete("/:id", authProtectMiddleware, deleteComment);
router.get("/:productId", getCommentsByProduct);
router.get("/rating/:productId", getProductRating);

module.exports = router;
