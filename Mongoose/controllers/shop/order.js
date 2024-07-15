const Product = require("../../models/product");
const Order = require("../../models/order");

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout Page",
    path: "/checkout",
    activeCheckout: true,
  });
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
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

  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
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

exports.postRemoveProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      throw new Error("Unable to find a product with the product id.");

    await req.user.removeFromCart(product);

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          product: {
            ...item.productId._doc,
          },
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      req.user.cart.items = [];
      req.user.save();
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
