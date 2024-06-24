const { Watch, Comment } = require("../models/watch");
const { validationResult } = require("express-validator");

class commentController {
  async addCommentToWatch(req, res) {
    const errors = validationResult(req);
    const watchId = req.params.id;

    if (!errors.isEmpty()) {
      req.flash(
        "message",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      req.flash("success", false);
      return res.redirect(`/watch/${watchId}`);
    }

    const { content, rating } = req.body;

    try {
      // Find the watch by ID
      const watch = await Watch.findById(watchId).populate("comments");
      if (!watch) {
        req.flash("message", "Watch not found!");
        req.flash("success", false);
        return res.redirect(`/watch/${watchId}`);
      }

      // Check if the user has already commented on this watch
      const hasCommented = watch.comments.some((comment) =>
        comment.author.equals(req.user._id)
      );
      if (hasCommented) {
        req.flash("message", "You have already commented on this watch.");
        req.flash("success", false);
        return res.redirect(`/watch/${watchId}`);
      }

      // Create a new comment
      const newComment = new Comment({
        content,
        rating,
        author: req.user._id, // Assuming req.user._id is the author's ID (logged in member)
      });

      // Add the comment to the watch's comments array
      watch.comments.push(newComment);

      // Save the new comment and the updated watch object
      await newComment.save();
      await watch.save();

      req.flash("message", "Comment added successfully!");
      req.flash("success", true);
      res.redirect(`/watch/${watchId}`);
    } catch (error) {
      console.error("Error adding comment to watch:", error);
      req.flash("message", "Error adding comment to watch!");
      req.flash("success", false);
      res.redirect(`/watch/${watchId}`);
    }
  }
}

module.exports = new commentController();
