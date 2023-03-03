const redis = require('redis');
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

exports.connect = async () => {
  client.on('connect', function () {
    console.log('Redis connected!'); // Connected!
  });
  client.on('error', (err) => {
    console.log('Error ' + err);
  });

  await client.connect(); // Connect to Redis
  client.set('mykey', 'myvalue', function (err, reply) {
    console.log(reply);
  });

  client.get('mykey', function (err, reply) {
    console.log(reply);
  });
};
