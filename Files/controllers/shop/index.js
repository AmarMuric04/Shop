const Product = require("../../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products,
      pageTitle: "Home Page",
      path: "/",
      productCSS: true,
      activeIndex: true,
    });
  });
};
