const redis = require('../src/redis');
const db = redis();

db.healthCheck = function (cb) {
    const now = Date.now();
    db.set('!healthCheck', now, function(err){
        if(err) return cb(err);
        db.get('!healthCheck', function(err, then){
            if(err) return cb(err);
            if(now === then) return cb(new Error('DB write Failed'));
        })
    })
}

module.exports = db;