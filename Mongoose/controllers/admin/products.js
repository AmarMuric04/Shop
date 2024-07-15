const Product = require("../../models/product");

exports.getAddProduct = (req, res) => {
  console.log("...");
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
  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });

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

  Product.findById(productId)
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

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(() => {
      console.log(title + " updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res) => {
  Product.find()
    // .populate("userId")
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

  Product.findByIdAndDelete({ _id: productId })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
