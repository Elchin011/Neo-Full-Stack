const express = require("express");

const { authProtectMiddleware } = require("../middleware/authProtectMiddleware");
const { createComment, getCommentsByProduct ,deleteComment } = require("../controllers/CommentController");


const router = express.Router();

// məhsula comment yazmaq
router.post("/", authProtectMiddleware, createComment);

router.delete("/:id", authProtectMiddleware, deleteComment);
// məhsul üzrə bütün commentləri gətirmək
router.get("/:productId", getCommentsByProduct);

module.exports = router;
