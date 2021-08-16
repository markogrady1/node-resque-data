const Scheduled = require('../src/scheduled');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

let queue;

beforeEach(() => {
  queue = new Scheduled(_setupQueueConfig());
});

describe('test Scheduled Class', function () {
  test('test scheduled attributes', async () => {
    // config contents
    expect(queue.store.namespace).toEqual('my-test-namespace');
    // redis contents
    expect(queue.store.redis).toEqual(
      expect.objectContaining({
        _events: {},
        customCommands: {}
      })
    );
  });
  test('test getScheduledJobs', async () => {
    const result = await queue.getScheduledJobs();
    expect(result).toEqual({scheduledJobs: 0});
  });

  test('test getScheduledJobs with extra details', async () => {
    queue.includeJobDetails = true;
    const result = await queue.getScheduledJobs();
    expect(result).toEqual({scheduledJobs: 0});
  });
});


function _setupQueueConfig() {
  return {
    queues: ['queueOne', 'queueTwo', 'queueThree', 'queueFour'],
    namespace: 'my-test-namespace'
  };
}
