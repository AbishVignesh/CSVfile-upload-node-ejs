import redis from 'redis';
import Promise from 'bluebird';

import Defines from './../../../config';

const redisClient = redis.createClient({
    host: Defines.REDIS_HOST,
    port: Defines.REDIS_PORT,
    password: Defines.REDIS_AUTH,
    db: Defines.REDIS_DB
});

Promise.promisifyAll(redisClient);
Promise.promisifyAll(redis.Multi.prototype);


redisClient.on('error', function(err) {
    console.log(err);
});

redisClient.on('ready', function(err) {
    console.log("ready " + err);
});

redisClient.on('reconnecting', function(err) {
    console.log("reconnecting " + err);
});

export default redisClient;