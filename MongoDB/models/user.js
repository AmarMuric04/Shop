const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    console.log("User added!");
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
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
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        {
          _id: this._id,
        },
        { $set: { cart: updatedCart } }
      )
      .catch((err) => console.log(err));
  }

  removeFromCart(product) {
    const productIndex = this.cart.items.findIndex(
      (prod) => prod.productId.toString() === product._id.toString()
    );
    const updatedItems = [...this.cart.items];

    if (updatedItems[productIndex].quantity > 1) {
      updatedItems[productIndex].quantity--;
    } else updatedItems.splice(productIndex, 1);

    const updatedCart = { items: updatedItems };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        {
          _id: this._id,
        },
        { $set: { cart: updatedCart } }
      )
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((prod) => prod.productId);

    /* basically what this does is...ǐ̴̧͇͔̳̯̦̺̩̺͎̙͈͇͗̿ ̷̤͚͊͑͋́̔̆́͋̅͑̀̀̚̚͝ḩ̴̹̹͚̙̯͕̊̑̓̿̆͒̂̈̏ą̶̘̗͉̗̟̞̮̻̲͇̹̝̎͒̍̌̂̿̓̏͑̾̾̑ͅv̸̧̢̳̗̼͍͕̑̚̚̚e̷̡͍͇͙͖̱̅̃̓̽͋͊̏̿̕̚ͅͅ ̷̖̽̈́̊̚ǹ̷̨̛̞̬͙͙̦̰̼̼̋ọ̸̧̢̺͕̜̠̤͙̬̥̋̈́̋̑̈́͗͒̃̔̅̕̕͠͝ͅ ̵̭̪͇͕̂̆̔̈́̍̑̄͠ͅf̵̡̮͈̗̝̼̤̮̘̠͗̋͗͑̎̏̓̂͝u̸̲͍͕̺̲̼̖̦̝͉̽̆̚͜ć̶̨͕͓̔̐͗̽̐͊͐̀̄͝͝͝ḱ̶͕̯̘̗̼̟͇̞͉͔̽̓̂̓̔͑͝ǐ̵̭͙̮̯̟͙̫͔̗͔̀̊̆̿͒̓̅̾̓̐͆͜n̵͎̦͙̄̄̅͗͊̓̉̏ģ̶͚̱̿̒̌̊̇̒̔̂̕ ̷̡̡̛͉͔̣̮͔͈̣̩̌̒̌̋̏͌͆̈͐͒͑͜͜͠͠ī̷̲͖̯̦̪͎̤̹̮̹͋̒́̔̈́͛͝ḑ̵̢̯̣͇͎͓̈́̾̈́ȩ̵̡͍͔̲͈͍͉͖̩̱̻̯̠͇̓͊̅̈̀͘͝ả̵̦͔̲͎͕̃̿̀͑̈́̿̃̈́̑ */

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find(
              (p) => p.productId.toString() === prod._id.toString()
            ).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
            email: this.email,
          },
        };

        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db.collection("users").updateOne(
          {
            _id: this._id,
          },
          { $set: { cart: { items: [] } } }
        );
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(id) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
