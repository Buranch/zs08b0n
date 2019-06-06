var name = require('./package.json').name
require('productionize')(name)
const server = require('./lib/server')
const port = process.env.PORT || 5100
server().listen(port)
console.log(name, 'Server listening on port', port)
