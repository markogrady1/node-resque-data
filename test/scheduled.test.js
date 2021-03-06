const Scheduled = require('../src/scheduled');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

let sched;
beforeEach(() => {
  sched = new Scheduled(_setupQueueConfig());
});

afterEach(() => {
  sched = undefined;
});

describe('test Scheduled Class', function () {
  test('test scheduled attributes', async () => {
    // config contents
    expect(sched.store.namespace).toEqual('my-test-namespace');
    // redis contents
    expect(sched.store.redis).toEqual(
      expect.objectContaining({
        _events: {},
        customCommands: {},
        connected: true
      })
    );
  });
  test('test getScheduledJobs', async () => {
    const result = await sched.getScheduledJobs();
    expect(result).toEqual({scheduledJobs: 0});
  });

  test('test getScheduledJobs with extra details', async () => {
    sched.includeJobDetails = true;
    const result = await sched.getScheduledJobs();
    expect(result).toEqual({scheduledJobs: 0});
  });
});


function _setupQueueConfig() {
  return {
    queues: ['queueOne', 'queueTwo', 'queueThree', 'queueFour'],
    namespace: 'my-test-namespace'
  };
}
