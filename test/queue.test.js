const Queue = require('../src/queue');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

let queue;

beforeEach(() => {
  queue = new Queue(_setupQueueConfig())
});

describe('test Queue Class', function() {
  test('test queue attributes', async () => {
    // config contents
    expect(queue.namespace).toEqual('my-test-namespace');
    // redis contents
    expect(queue.redis).toEqual(expect.objectContaining({
      _events: {},
      customCommands: {},
    }));
  });
  test('test queueStats', async () => {
    const result = await queue.queueStats(_setupQueueConfig().queues)
    expect(result).toEqual(_getQueueResult())
  });

  test('test queueForUI', async () => {

    const fn = data => expect(data).toEqual(_getQueueResult());

    const result = await queue.queueForUI(_setupQueueConfig().queues, fn);
  });

  test('test _getQueueLengths', async () => {
    const result = await queue._getQueueLengths(_setupQueueConfig().queues)
    expect(result).toEqual(_getQueueResult())
  });

  test('test _getQueueLengths with callback', async () => {
    const fn = data => expect(data).toEqual(_getQueueResult());
    const resultCallback = await queue._getQueueLengths(_setupQueueConfig().queues, fn);
  });
});

function _getQueueResult() {
  return [{
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
  }
}