const mongoose = require("mongoose");
const User = require("../models/user");

async function startServer(app) {
  try {
    await mongoose.connect(
      "mongodb+srv://muricamar2004:EIepBuaABD7d7VQg@nodejs.vbqigm9.mongodb.net/shop?retryWrites=true"
    );

    let alreadyExistingUser = await User.findOne();

    if (!alreadyExistingUser)
      alreadyExistingUser = new User({
        name: "Murga",
        email: "muricamar2004@gmail.com",
        cart: {
          items: [],
        },
      });

    await alreadyExistingUser.save();

    console.log("User created:", alreadyExistingUser);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = startServer;
