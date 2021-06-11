import Job from './Job.js';

export default class Queue {
  constructor () {
      this.job = new Job();

  }

  async add(name, opts) {

      opts = JSON.stringify(opts);

      const job = await this.job.create(name, opts, {});

      console.log(job)
  }
}
