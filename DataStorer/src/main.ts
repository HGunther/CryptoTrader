import zmq = require("zeromq");
import mongod = require("mongodb");

var sock = zmq.socket("pull");
const port = 6006;

sock.connect("tcp://127.0.0.1:" + port);
console.debug("DataStorer recieving prices on port " + port);

sock.on("message", function(msg) {
  console.log("work: %s", msg.toString());
});