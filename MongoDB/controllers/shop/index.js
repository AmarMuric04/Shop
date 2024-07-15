const Product = require("../../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
