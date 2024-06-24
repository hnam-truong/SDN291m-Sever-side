const Brand = require("../models/brand");
const { validationResult } = require("express-validator");
const { Watch } = require("../models/watch");

class brandController {
  async getListOfBrand(req, res) {
    try {
      const brands = await Brand.find().sort({ brandName: 1 }).lean();
      res.status(200).render("adminBrands", {
        brandData: brands,
        success: req.flash("success"),
        message: req.flash("message"),
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error");
    }
  }

  async deleteBrandById(req, res) {
    try {
      const brandId = req.params.id;
      const watches = await Watch.find({ brand: brandId });

      if (watches.length > 0) {
        req.flash(
          "message",
          "Cannot delete brand. It is referenced by one or more watches."
        );
        req.flash("success", false);
        res.redirect("/admin/brands");
        return;
      }

      await Brand.findByIdAndDelete(brandId);
      req.flash("message", "Brand deleted successfully!");
      req.flash("success", true);
      res.redirect("/admin/brands");
    } catch (error) {
      console.log("deleteBrandById error", error);
      req.flash("message", "Error while deleting brand!");
      req.flash("success", false);
      res.redirect("/admin/brands");
    }
  }

  async renderAddBrand(req, res) {
    try {
      const brands = await Brand.find();
      res.status(200).render("adminAddBrand", {
        brands,
        message: req.flash("message"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.log("renderAddBrand error", error);
      res.render("error");
    }
  }
  async addNewBrand(req, res) {
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
      res.redirect("/admin/brands/add");
      return;
    }

    const { brandName } = req.body;
    try {
      const brand = await Brand.findOne({ brandName });
      if (brand) {
        req.flash("message", "Brand already exists!");
        req.flash("success", false);
        res.redirect("/admin/brands/add");
        return;
      }
      const newBrand = new Brand({
        brandName,
      });
      await newBrand.save();
      req.flash("message", "Brand added successfully!");
      req.flash("success", true);
      res.redirect("/admin/brands");
    } catch (error) {
      console.log("addNewBrand error", error);
      req.flash("message", "Error while adding brand!");
      req.flash("success", false);
    }
  }

  async renderEditBrand(req, res) {
    try {
      const brand = await Brand.findById(req.params.id);
      res.status(200).render("adminEditBrand", {
        brand,
        message: req.flash("message"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.log("renderEditBrand error", error);
      res.render("error");
    }
  }

  async editBrandById(req, res) {
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
      res.redirect("/admin/brands/edit/" + req.params.id);
      return;
    }

    const { brandName } = req.body;
    try {
      const brand = await Brand.findByIdAndUpdate(req.params.id, {
        brandName,
      });
      req.flash("message", "Brand updated successfully!");
      req.flash("success", true);
      res.redirect("/admin/brands");
    } catch (error) {
      console.log("editBrandById error", error);
      req.flash("message", "Error while updating brand!");
      req.flash("success", false);
      res.redirect("/admin/brands/edit/" + req.params.id);
    }
  }

  async deleteBrandById(req, res) {
    try {
      const brandId = req.params.id;
      const watches = await Watch.find({ brand: brandId });

      if (watches.length > 0) {
        req.flash(
          "message",
          "Cannot delete brand. It is referenced by one or more watches."
        );
        req.flash("success", false);
        res.redirect("/admin/brands");
        return;
      }

      await Brand.findByIdAndDelete(brandId);
      req.flash("message", "Brand deleted successfully!");
      req.flash("success", true);
      res.redirect("/admin/brands");
    } catch (error) {
      console.log("deleteBrandById error", error);
      req.flash("message", "Error while deleting brand!");
      req.flash("success", false);
      res.redirect("/admin/brands");
    }
  }
}

module.exports = new brandController();
