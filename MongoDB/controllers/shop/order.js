const Product = require("../../models/product");

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout Page",
    path: "/checkout",
    activeCheckout: true,
  });
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Cart Page",
        path: "/cart",
        activeCart: true,
        products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.fetchById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Order Page",
        path: "/orders",
        activeCart: true,
        orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postRemoveProduct = (req, res) => {
  const { productId } = req.body;

  Product.fetchById(productId)
    .then((product) => {
      req.user.removeFromCart(product);
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};
