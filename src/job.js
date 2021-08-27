const Connection = require('./redis');

module.exports = class Jobs {
  constructor(config = undefined, store) {
    this.store = store || new Connection(config)
  }

  async jobsForUI() {
    return await this._getJobs();
  }

  async jobStats() {
    return await this._getJobs(true);
  }

  async _getJobs(raw) {
    const failed = await this.store.redis.mget(`${this.store.namespace}:stat:failed`);
    const failing = await this.store.redis.llen(`${this.store.namespace}:processed`);
    const processed = await this.store.redis.mget(`${this.store.namespace}:stat:processed`);
    const worker = await this.store.redis.smembers(`${this.store.namespace}:workers`);

    const jobData = {
      processed: processed[0],
      failed: failed[0],
      failing
    };

    return jobData;
  }
};
