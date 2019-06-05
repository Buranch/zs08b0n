var db = require("../db");

const getBuyerById = (id) => `buyers:${id}`;

const findHighestInterceptedLocation = (sortedLocations, filteredLocation) =>
  sortedLocations.find((location) => filteredLocation
  .some((intersectedLocation) => location === intersectedLocation));

const put = (buyer, callback) => {
  const multi = db.multi();
  multi.set(getBuyerById(buyer.id), JSON.stringify(buyer));
  // Facilitating route search, by grouping "location" with different criteria keys
  buyer.offers.forEach(function(offer) {
    // score = value, location
    multi.zadd("location", offer.value, offer.location);
    for (var key in offer.criteria) {
        if(offer.criteria[key]) {
            offer.criteria[key].forEach(function (value) {
            //eg. device:desktop = [ http://0.c.com ]
            multi.sadd(`${key}:${value}`, offer.location)
            })
        }
    }

  });
  multi.exec(callback);
}

const get = (id, callback) => db.get(getBuyerById(id), callback);

const route = (options, callback) => {

  const { query } = options;
  const { device, state } = query;
  const date = new Date(query.timestamp);
  const hour = date.getUTCHours();
  const day = date.getUTCDay();


  const intersectBy = [
    `device:${device}`,
    `hour:${hour}`,
    `day:${day}`,
    `state:${state}`
  ];

  const multi = db.multi();
  multi
    .zrangebyscore("location", '-inf', '+inf').sinter(intersectBy)
    .exec(function(err, result) {
      if (err) return callback(err);
      const highestLocation = findHighestInterceptedLocation(
        result[0].reverse(),// sorted
        result[1]// intercepted
      );
      callback(null, highestLocation);
    });
}


module.exports = {
    put: put,
    get: get,
    route: route,
  };