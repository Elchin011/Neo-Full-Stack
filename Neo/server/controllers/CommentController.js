const Comment = require("../models/Comment/CommentSchema");

const createComment = async (req, res) => {
  try {
    const { product, comment, rating } = req.body; // ✅ "comment" backend-ə uyğun
    const userId = req.user.id;

    const newComment = await Comment.create({
      product,
      user: userId,
      comment,
      rating,
    });

    await newComment.populate("user", "name");

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Comment yaradılmadı", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id).populate("user");
    if (!comment) {
      return res.status(404).json({ message: "Comment tapılmadı" });
    }

    if (comment.user._id.toString() !== userId) {
      return res.status(403).json({
        message: "Bu əməliyyatı yerinə yetirmək üçün yetkiniz yoxdur",
      });
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment silindi" });
  } catch (err) {
    res.status(500).json({ message: "Comment silinmədi", error: err.message });
  }
};

const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ product: productId })
      .populate("user", "name") // user adı görünsün
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Şərhləri gətirmək olmadı", error: err.message });
  }
};

const getProductRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ product: productId });

    if (!comments.length)
      return res.json({ averageRating: 0, totalRatings: 0 });

    const totalRating = comments.reduce((sum, c) => sum + (c.rating || 0), 0);
    const averageRating = totalRating / comments.length;

    res.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: comments.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Rating hesablamaq mümkün olmadı", error: err.message });
  }
};

module.exports = { createComment, getCommentsByProduct, deleteComment, getProductRating };
