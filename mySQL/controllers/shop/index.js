const Product = require("../../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        products: rows,
        pageTitle: "Home Page",
        path: "/",
        productCSS: true,
        activeIndex: true,
      });
    })
    .catch((err) => console.log(err));
};
