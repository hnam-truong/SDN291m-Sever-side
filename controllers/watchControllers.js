const Brand = require("../models/brand");
const { Watch } = require("../models/watch");
const { validationResult } = require("express-validator");

class watchController {
  // createWatch(req, res) {
  //   try {
  //     Watch.create(req.body).then((bl) => {
  //       res.json(bl);
  //     });
  //   } catch (error) {
  //     res.json(error);
  //   }
  // }

  async getListOfWatch(req, res) {
    try {
      const watches = await Watch.find()
        .populate({
          path: "brand",
          select: "brandName",
        })
        .sort({ createdAt: -1 })
        .lean();
      const brands = await Brand.find().sort({ brandName: 1 }).lean();
      res.status(200).render("index", {
        watchData: watches,
        brandData: brands,
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error");
    }
  }

  async getWatchById(req, res) {
    try {
      const watch = await Watch.findById(req.params.id)
        .populate({
          path: "brand",
          select: "brandName",
        })
        .populate({
          path: "comments",
          populate: {
            path: "author",
            model: "Members",
            select: "memberName",
          },
          options: { sort: { createdAt: -1 } },
        })
        .lean();
      res.status(200).render("watchDetail", {
        watch,
        success: req.flash("success"),
        message: req.flash("message"),
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error");
    }
  }

  async getListOfAdminWatch(req, res) {
    try {
      const watches = await Watch.find()
        .populate({
          path: "brand",
          select: "brandName",
        })
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();
      const brands = await Brand.find().lean();
      res.status(200).render("adminWatches", {
        watchData: watches,
        brandData: brands,
        success: req.flash("success"),
        message: req.flash("message"),
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error");
    }
  }

  async renderAddWatch(req, res) {
    try {
      const brands = await Brand.find().sort({ brandName: 1 }).lean();
      res.status(200).render("adminAddWatch", {
        brands,
        message: req.flash("message"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.log("renderAddWatch error", error);
      res.render("error");
    }
  }
  async addNewWatch(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "message",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      req.flash("success", false);
      res.redirect("/admin/watches/add");
      return;
    }
    const { watchName, price, image, watchDescription, brand, automatic } =
      req.body;
    try {
      const newWatch = new Watch({
        brand,
        image,
        price,
        automatic: automatic === "on",
        watchName,
        watchDescription,
      });
      await newWatch.save();
      req.flash("message", "Watch added successfully!");
      req.flash("success", true);
      res.redirect("/admin/watches");
    } catch (error) {
      console.log("addWatch error", error);
      req.flash("message", "Error while adding watch!");
      req.flash("success", false);
      res.redirect("/admin/watches/add");
    }
  }

  async renderEditWatch(req, res) {
    try {
      const brands = await Brand.find();
      const watch = await Watch.findById(req.params.id);
      res.status(200).render("adminEditWatch", {
        watch,
        brands,
        message: req.flash("message"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.log("renderEditWatch error", error);
      res.render("error");
    }
  }
  async editWatchById(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "message",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      req.flash("success", false);
      res.redirect("/admin/watches/edit/" + req.params.id);
      return;
    }
    try {
      const { watchName, price, image, watchDescription, brand, automatic } =
        req.body;
      const watch = await Watch.findByIdAndUpdate(req.params.id, {
        brand,
        image,
        price,
        automatic: automatic === "on",
        watchName,
        watchDescription,
      });
      req.flash("message", "Watch updated successfully!");
      req.flash("success", true);
      res.redirect("/admin/watches");
    } catch (error) {
      console.log("editWatchById error", error);
      req.flash("message", "Error while updating watch!");
      req.flash("success", false);
      res.redirect("/admin/watches/edit/" + req.params.id);
    }
  }

  async deleteWatchById(req, res) {
    try {
      const watch = await Watch.findByIdAndDelete(req.params.id);
      req.flash("message", "Watch deleted successfully!");
      req.flash("success", true);
      res.redirect("/admin/watches");
    } catch (error) {
      console.log("deleteWatchById error", error);
      req.flash("message", "Error while deleting watch!");
      req.flash("success", false);
      res.redirect("/admin/watches");
    }
  }
}

module.exports = new watchController();
