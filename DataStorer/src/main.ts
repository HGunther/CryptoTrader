import zmq = require("zeromq");
import mongodb = require("mongodb");
import { Price } from "../../protobuf/js/price_pb"
import { Prices } from "../../protobuf/js/prices_pb"

// Setup mongodb connection
const db_url = 'mongodb://localhost:27017';
const dbName = 'CryptoPriceData';
const dbclient = new mongodb.MongoClient(db_url);

// Setup ZMQ socket
var socket = zmq.socket("pull");
const port = 6006;
socket.connect("tcp://127.0.0.1:" + port);
console.debug("DataStorer recieving prices on port " + port);

// Connect to db
dbclient.connect()
.then(function onfulfilled(client : mongodb.MongoClient) {
  console.log("Connected to " + db_url);

  const db = dbclient.db(dbName);




  dbclient.close();
})
.catch(function onrejected(reason){
  console.error("Failed to connect to " + db_url);
  console.error("Error: " + reason);
})
.finally();

socket.on("message", function(msg : any) {
  console.debug("DataStorer recieved message: " + msg);
  let price = Price.deserializeBinary(Uint8Array.from(msg));
  console.debug("Recieved price: " + price);
});