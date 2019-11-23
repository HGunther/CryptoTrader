import zmq = require("zeromq");
import mongod = require("mongodb");
import { Price } from "../../protobuf/js/price_pb"
import { Prices } from "../../protobuf/js/prices_pb"

var sock = zmq.socket("pull");
const port = 6006;

sock.connect("tcp://127.0.0.1:" + port);
console.debug("DataStorer recieving prices on port " + port);

sock.on("message", function(msg : any) {
  console.debug("DataStorer recieved message: " + msg);
  let price = Price.deserializeBinary(Uint8Array.from(msg));
  console.debug("Recieved price: " + price);
});