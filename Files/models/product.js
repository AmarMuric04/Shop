const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, "utf8", (err, data) => {
    if (err) return cb([]);
    if (data) cb(JSON.parse(data));
    else cb([]);
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        console.log(existingProductIndex, updatedProducts);

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.error(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.error(err);
        });
      }
    });
  }

  static delete(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProduct = products.filter((product) => product.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.id);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      cb(product);
    });
  }
};
