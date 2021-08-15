const Connection = require('./redis');

module.exports = class Scheduled {
  constructor(config = undefined) {
    this.config = config;
    this.store = new Connection(config);
  }

  getScheduledJobs(fn) {
    let keys = [];
    // get all scheduled keys
    this.store.redis.scanStream({
      match: this.store.namespace + ':delayed:*',
    }).on('data', data => {
      keys = keys.concat(data);
    }).on('end', async () => {
      const queueData = {
        scheduledJobs: keys.length,
      };

      if (this.config.opts.includeJobDetails) {
        queueData.scheduledJobsDetails = [];
        for (let i of keys) {
          const jobs =  await this.getScheduledJobContent(i);
          queueData.scheduledJobsDetails.push(jobs)
        }
      }
      fn(queueData);
    });
  }

  async getScheduledJobContent(key) {
    const scheduledJob = await this.store.redis.lrange(key, 0, 0);
    const sheduledJobContent = JSON.parse(scheduledJob);
    sheduledJobContent.runTime = new Date(key.split(':')[2] * 1000);
    return sheduledJobContent;
  }
}
