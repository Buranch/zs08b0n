var body = require('body/json')
var send = require('send-data/json')

var Buyers = require('./models/model')

module.exports = {
  put: put,
  get: get,
  route: route
}

function put (req, res, options, callback) {
  body(req, res, function (err, data) {
    if (err) return callback(err)
    Buyers.put(data, function (err) {
      if (err) return callback(err)
      res.statusCode = 201
      send(req, res, data)
    })
  })
}

function get (req, res, options, callback) {
  Buyers.get(options.params.key, function (err, buyer) {
    if (err) return callback(err)
    send(req, res, JSON.parse(buyer))
  })
}

function route (req, res, options, callback) {
  Buyers.route(options, function (err, location) {
    if (err) return callback(err)
    send(req, res, {
      headers: {
        location: location
      },
      statusCode: 302
    })
  })
}