import Redis from 'ioredis';

export default class Job {
  constructor () {
      this.client = new Redis();

  }
  async create(key, opts, args) {
      const res = await this.client.set(key, opts);

      return res;
  }
}
