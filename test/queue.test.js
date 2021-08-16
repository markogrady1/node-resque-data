const Queue = require('../src/queue');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

let queue;

beforeEach(() => {
  queue = new Queue(_setupQueueConfig());
});

describe('test Queue Class', function () {
  test('test queue attributes', async () => {
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
  test('test queueStats', async () => {
    const result = await queue.queueStats();
    expect(result).toEqual(_getQueueResult());
  });

  test('test queueForUI', async () => {
    const result = await queue.queueForUI();
    expect(result).toEqual(_getQueueResult());
  });

  test('test _getQueueLengths', async () => {
    const result = await queue._getQueueLengths();
    expect(result).toEqual(_getQueueResult());
  });

  test('test _getQueueLengths with callback', async () => {
    const resultCallback = await queue._getQueueLengths();
    expect(resultCallback).toEqual(_getQueueResult());
  });
});

function _getQueueResult() {
  return [
    {
      queue: 'queueOne',
      num: 0
    },
    {
      queue: 'queueTwo',
      num: 0
    },
    {
      queue: 'queueThree',
      num: 0
    },
    {
      queue: 'queueFour',
      num: 0
    }
  ];
}

function _setupQueueConfig() {
  return {
    queues: ['queueOne', 'queueTwo', 'queueThree', 'queueFour'],
    namespace: 'my-test-namespace'
  };
}
