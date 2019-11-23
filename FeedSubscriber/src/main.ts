import fs = require("fs");
import KrakenClient = require("kraken-api");
import { Price } from "../../protobuf/js/price_pb"
import { Prices } from "../../protobuf/js/prices_pb"
import { Time } from "../../protobuf/js/time_pb"
import zmq = require("zeromq");
var sock = zmq.socket("push");

interface tickerPacket{
    // <pair_name> = pair name
    // a = ask array(<price>, <whole lot volume>, <lot volume>),
    // b = bid array(<price>, <whole lot volume>, <lot volume>),
    // c = last trade closed array(<price>, <lot volume>),
    // v = volume array(<today>, <last 24 hours>),
    // p = volume weighted average price array(<today>, <last 24 hours>),
    // t = number of trades array(<today>, <last 24 hours>),
    // l = low array(<today>, <last 24 hours>),
    // h = high array(<today>, <last 24 hours>),
    // o = today's opening price
    XXBTZUSD: {
        a : string[];
        b : string[];
        c : string[];
        v : string[];
        p : number[];
        t : string[];
        l : string[];
        h : string[];
        o : string[];
    }
}

const key = fs.readFileSync('../Keys/Kraken.public.txt', { encoding: "utf8" });
const secret = fs.readFileSync('../Keys/Kraken.private.txt', { encoding: "utf8" });
const kraken = new KrakenClient(key, secret);

const port = 6006;
sock.bindSync("tcp://127.0.0.1:" + port);
console.log("FeedSubscriber sending prices to port " + port);

const delay = 3000 * 2;

async function fetchData(): Promise<tickerPacket> {
    console.debug("Requesting data from server...");
    let data: tickerPacket = kraken.publicMethod('Ticker', { pair: 'XXBTZUSD' });
    return data;
}

function doAThingWithData(data: tickerPacket): void {
    console.info("Last trade: " + data.XXBTZUSD.c[1] + " units at " + data.XXBTZUSD.c[0] + " each.");

    let now = new Date();
    let time = new Time();
    time.setYear(now.getFullYear());
    time.setMonth(now.getMonth());
    time.setDay(now.getDay());
    time.setHour(now.getHours());
    time.setMinute(now.getMinutes());
    time.setSecond(now.getSeconds());

    let price = new Price();
    price.setTime(time);
    price.setCurrency("XXBTZUSD");
    price.setPrice(parseFloat(data.XXBTZUSD.c[0]));

    let message = new Buffer(price.serializeBinary());
    console.debug("Sending message: " + message);
    sock.send(message);
};


setInterval(function () {
// setImmediate(function () {
    console.debug("Begining loop at " + Date().toString());
    console.time("loop_timer");
    fetchData()
        .then(
            function onFulfilled(response) {
                console.log("Response: ", response);
                console.debug("Recieved response.");
                if (response["error"].length > 0) {
                    console.error("Recieved error message from server. " + response["error"]);
                    console.debug("Message: " + JSON.stringify(response));
                }
                else {
                    console.debug("No errors recieved.");
                    doAThingWithData(response["result"]);
                }
            },
            function onRejected(reason) {
                console.error("No response recieved. " + reason);
            })
        .finally(
            function () {
                console.timeEnd("loop_timer");
            }
        );
}, delay);
