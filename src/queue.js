// import Job from './Job.js';
const Redis = require('ioredis');


/*

new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "auth",
  db: 0,
});

*/
module.exports = class Queue {
  constructor (config = undefined) {
    this.namespace = config.namespace || 'resque'
    this.redis = new Redis(config);
  }

  async queue(queues, fn) {
    let queueLen = [];
    for (const index in queues) {
      const length = await this.redis.llen(`${this.namespace}:queue:${queues[index]}`);
      queueLen.push({
        queue: queues[index],
        num: length
      });
    }
    fn(queueLen);
  }
}
