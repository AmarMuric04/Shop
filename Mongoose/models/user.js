const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.removeFromCart = function (product) {
  const productIndex = this.cart.items.findIndex(
    (prod) => prod.productId.toString() === product._id.toString()
  );
  const updatedItems = [...this.cart.items];

  if (updatedItems[productIndex].quantity > 1) {
    updatedItems[productIndex].quantity--;
  } else updatedItems.splice(productIndex, 1);

  this.cart.items = updatedItems;
  return this.save();
};

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (prod) => prod.productId.toString() === product._id.toString()
  );
  let newQuantity = 1;

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: this._id,
//             username: this.username,
//             email: this.email,
//           },
//         };

//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db.collection("users").updateOne(
//           {
//             _id: this._id,
//           },
//           { $set: { cart: { items: [] } } }
//         );
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(id) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .findOne({ _id: ObjectId.createFromHexString(id) })
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
