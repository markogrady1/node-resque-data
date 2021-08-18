const Connection = require('./redis');

module.exports = class Scheduled {
  constructor(config = undefined) {
    this.config = config;
    this.store = new Connection(config);
  }

  getScheduledJobs() {
    // get all scheduled keys
    return new Promise((resolve, reject) => {
      const stream = this.store.redis.scanStream({
        match: this.store.namespace + ':delayed:*'
      });
      let keys = [];
      stream.on('data', data => {
        keys = keys.concat(data);
      });
      stream.on('end', async () => {
        const queueData = {
          scheduledJobs: keys.length
        };

        if (this.config.opts && this.config.opts.includeJobDetails) {
          queueData.scheduledJobsDetails = [];
          for (let i of keys) {
            const jobs = await this.getScheduledJobContent(i);
            queueData.scheduledJobsDetails.push(jobs);
          }
        }
        resolve(queueData);
      });
      stream.on('error', error => reject(error));
    });
  }

  async getScheduledJobContent(key) {
    const scheduledJob = await this.store.redis.lrange(key, 0, 0);
    const sheduledJobContent = JSON.parse(scheduledJob);
    sheduledJobContent.runTime = new Date(key.split(':')[2] * 1000);
    return sheduledJobContent;
  }
};
