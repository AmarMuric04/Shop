const Product = require("../../models/product");

exports.getProductList = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products,
      hasProducts: products.length > 0,
      pageTitle: "Product Page",
      path: "/products",
      activeProductList: true,
      productCSS: true,
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const { productId } = req.params;

  Product.fetchById(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};
