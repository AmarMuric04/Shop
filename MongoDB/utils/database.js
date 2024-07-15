const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://muricamar2004:EIepBuaABD7d7VQg@nodejs.vbqigm9.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJS"
  )
    .then((client) => {
      console.log("Connected to MongoDB!");
      _db = client.db();
      cb(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
