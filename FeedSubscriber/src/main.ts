import fs = require("fs");
import KrakenClient = require("kraken-api");
import { Price } from "../../protobuf/js/price_pb"
import { Prices } from "../../protobuf/js/prices_pb"

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

const delay = 3000 * 2;

async function fetchData(): Promise<tickerPacket> {
    console.debug("Requesting data from server...");
    let data: tickerPacket = kraken.publicMethod('Ticker', { pair: 'XXBTZUSD' });
    return data;
}

function doAThingWithData(data: tickerPacket): void {
    console.info("Last trade: " + data.XXBTZUSD.c[1] + " units at " + data.XXBTZUSD.c[0] + " each.");
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
