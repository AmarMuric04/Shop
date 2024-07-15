const express = require("express");

const adminProductsController = require("../controllers/admin/products");

const router = express.Router();

router.get("/add-product", adminProductsController.getAddProduct);

router.post("/add-product", adminProductsController.postAddProduct);

router.post("/delete-product", adminProductsController.postDeleteProduct);

router.get("/edit-product/:productId", adminProductsController.getEditProduct);

router.post("/edit-product", adminProductsController.postEditProduct);

router.get("/products", adminProductsController.getAdminProducts);

router.post("/product", adminProductsController.postAddProduct);

module.exports = router;
