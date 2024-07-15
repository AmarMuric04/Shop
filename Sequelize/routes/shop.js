const express = require("express");

const productsController = require("../controllers/shop/products");
const orderController = require("../controllers/shop/order");
const indexController = require("../controllers/shop/index");

const router = express.Router();

router.get("/checkout", orderController.getCheckout);

router.get("/cart", orderController.getCart);

router.post("/cart", orderController.postCart);

router.get("/orders", orderController.getOrders);

router.get("/products", productsController.getProductList);

router.get("/products/:productId", productsController.getProductDetails);

router.post("/cart-delete-item", orderController.postRemoveProduct);

router.post("/create-order", orderController.postOrder);

router.get("/", indexController.getIndex);

module.exports = router;
