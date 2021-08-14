const Connection = require('./redis');

module.exports = class Scheduled {
  constructor(config = undefined) {
    this.store = new Connection(config);
  }

  getScheduledJobs(fn) {
    let keys = [];
    // get all delayed deletion keys
    const stream = this.store.redis.scanStream({
      match: '*:delayed:*',
      // match: this.store.namespace + ':delayed:*',
    })

    stream.on('data', data => {
      console.log('on data')
      console.log(data, keys, this.store.namespace + ':delayed:*')
      keys = keys.concat(data);
    }).on('end', () => {
      console.log('on end')
      const queueData = {
        scheduled: keys.length,
        datetime: new Date()
      };
      fn(queueData);
    });




//     const stream = redis.scanStream({
//   // only returns keys following the pattern of `user:*`
//   match: "user:*",
//   // only return objects that match a given type,
//   // (requires Redis >= 6.0)
//   type: "zset",
//   // returns approximately 100 elements per call
//   count: 100,
// });
  }

  // extract scheduled deletes information (not being used yet, may come in useful)
  async getScheduledJobContent(redis, key) {
    const scheduledJob = await this.store.redis.lrange(key, 0, 0);
    const sheduledJobContent = JSON.parse(scheduledJob);
    // get epoch section of delayed job
    // key example 'resque:delayed:123456789'
    const date = new Date(key.split(':')[2] * 1000);

    return {
      responseId: sheduledJobContent.args[0].responseId,
      clientId: sheduledJobContent.args[0].clientId,
      runTime: date.toISOString(),
      key: key,
    }
  }
  }
