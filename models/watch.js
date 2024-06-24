const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 3, require: true },
    content: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      require: true,
    },
  },
  { timestamps: true }
);

const watchSchema = new Schema(
  {
    watchName: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    automatic: { type: Boolean, default: false },
    watchDescription: { type: String, require: true },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      require: true,
    },
  },
  { timestamps: true }
);

const Watch = mongoose.model("Watches", watchSchema);
const Comment = mongoose.model("comments", commentSchema);

module.exports = { Watch, Comment };
