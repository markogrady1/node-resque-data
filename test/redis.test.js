const Connect = require('../src/redis');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

let connection;

beforeEach(() => {
  connection = new Connect(_setupQueueConfig());
});

afterEach(() => {
  connection = undefined;
});

describe('test Connect Class', function () {
  test('test namespace attributes', async () => {
    expect(connection.namespace).toEqual('my-test-namespace');
  });

  test('test redis attributes', async () => {
    expect(connection.redis).toEqual(
      expect.objectContaining({
        _events: {},
        connected: true
      })
    );
  });

  test('test namespace attributes', async () => {
    expect(connection.queues).toEqual(['queueOne', 'queueTwo', 'queueThree', 'queueFour']);
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
