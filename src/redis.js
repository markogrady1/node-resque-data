const Redis = require('ioredis');

/*

new Connect({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "auth",
  db: 0,
  namespace: 'beepbop',
  queues: ['beep', 'bop'],
});

*/
module.exports = class Connect {
  constructor(config = undefined) {
    this.namespace = config.namespace || 'resque';
    this.redis = new Redis(config);
    this.queues = config.queues;
  }
  // connection(config = undefined) {

  // }
}

