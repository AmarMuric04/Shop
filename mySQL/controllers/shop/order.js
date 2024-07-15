const Product = require("../../models/product");
const Cart = require("../../models/cart");

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout Page",
    path: "/checkout",
    activeCheckout: true,
  });
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll().then(([products]) => {
      const cartProducts = [];

      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData)
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
      }

      res.render("shop/cart", {
        pageTitle: "Cart Page",
        path: "/cart",
        activeCart: true,
        products: cartProducts,
      });
    });
  }).catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;

  Product.fetchById(productId).then(([product]) => {
    Cart.addProduct(product[0].id, product[0].price);
  });

  res.redirect("/cart");
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Order Page",
    path: "/orders",
    activeCart: true,
  });
};

exports.postRemoveProduct = (req, res) => {
  const { productId } = req.body;
  Product.fetchById(productId)
    .then(([product]) => {
      Cart.deleteProduct(productId, product.price);
      res.redirect("/cart");
    })
    .then((err) => console.log(err));
};
