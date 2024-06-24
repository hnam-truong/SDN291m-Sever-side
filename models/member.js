const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    memberName: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    yob: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Member = mongoose.model("Members", memberSchema);

module.exports = Member;
