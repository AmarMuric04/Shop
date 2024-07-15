const Product = require("../../models/product");

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Home Page",
        path: "/",
        productCSS: true,
        activeIndex: true,
      });
    })
    .catch((err) => console.log(err));
};
