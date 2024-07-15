const { getDb } = require("../../utils/database");
const { ObjectId } = require("mongodb");
const Product = require("../../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Products",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );

  product
    .save()
    .then(() => {
      console.log("Added " + title);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const { productId } = req.params;
  Product.fetchById(productId)
    .then((product) => {
      if (!product) return res.redirect("/");

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        formsCSS: true,
        productCSS: true,
        activeEditProduct: true,
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    ObjectId.createFromHexString(productId)
  );
  product
    .save()
    .then(() => {
      console.log(title + " updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        productCSS: true,
        activeAdminProductList: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
