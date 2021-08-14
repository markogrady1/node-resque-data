const Connection = require('./redis');

module.exports = class Queue {
  constructor(config = undefined) {
    this.store = new Connection(config);
  }

  async queueForUI(queues, fn) {
    this._getQueueLengths(fn);
  }

  async queueStats(queues) {
    const queueData = await this._getQueueLengths();
    return queueData;
  }

  async _getQueueLengths(fn = undefined) {
    let queueLen = [];
    const queues = this.store.queues;
    for (const index in queues) {
      const length = await this.store.redis.llen(`${this.namespace}:queue:${this.store.queues[index]}`);
      queueLen.push({
        queue: queues[index],
        num: length
      });
    }
    if (!fn) {
      return queueLen;
    }

    fn(queueLen);
  }
};
