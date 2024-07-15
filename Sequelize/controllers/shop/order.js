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
    .then((cart) => {
      return cart.getProducts();
    })
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
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) product = products[0];

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;

        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity,
        },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
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

  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      const product = products[0];
      if (product.cartItem.quantity === 1) {
        return product.cartItem.destroy();
      } else {
        const oldQuantity = product.cartItem.quantity;
        const newQuantity = oldQuantity - 1;

        return fetchedCart.addProduct(product, {
          through: {
            quantity: newQuantity,
          },
        });
      }
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let prods;
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      {
        prods = products;
        return req.user.createOrder();
      }
    })
    .then((order) => {
      return order.addProducts(
        prods.map((prod) => {
          prod.orderItem = { quantity: prod.cartItem.quantity };
          return prod;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};
