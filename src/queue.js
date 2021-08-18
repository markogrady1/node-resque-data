const Connection = require('./redis');

module.exports = class Queue {
  constructor(config = undefined) {
    this.store = new Connection(config);
  }

  async queueForUI() {
    return await this._getQueueLengths();
  }

  async queueStats() {
    return await this._getQueueLengths(true);
  }

  async _getQueueLengths(raw) {
    let queueLen = [];
    try {
      const queues = this.store.queues;
      for (const index in queues) {
        const length = await this.store.redis.llen(`${this.store.namespace}:queue:${this.store.queues[index]}`);
        queueLen.push({
          queue: queues[index],
          num: length
        });
      }
      if (raw) {
        return queueLen;
      }

      return new Promise((resolve, reject) => {
        resolve(queueLen);
      });
    } catch (err) {
      reject(err);
    }
  }
};
