import mongodb = require("mongodb");
import assert = require("assert");
import { Price } from "../../protobuf/js/price_pb"
import { Prices } from "../../protobuf/js/prices_pb"


const formatPriceToRecord = function(price: Price):any{
    let time = new Date();
    time.setFullYear(price.getTime().getYear());
    time.setMonth(price.getTime().getMonth());
    time.setDate(price.getTime().getDay());
    time.setHours(price.getTime().getHour());
    time.setMinutes(price.getTime().getMinute());
    time.setSeconds(price.getTime().getSecond());
  
    let record = {};
    record["price"] = price.getPrice();
    record["time"] = time;
    
    return record;
  }
  
  export const insertPrice = function (db: mongodb.Db, price: Price) {
    // Get the documents collection
    const collection = db.collection(price.getCurrency());
    // Insert some documents
    let record = formatPriceToRecord(price);
  
    collection.insertOne(record, function (error: mongodb.MongoError) {
      if (error != null){
        console.error("Error inserting record into database: " + error);
      }
      else{
        console.debug("Insertion successful");
      }
    });
  }