const {Queue, Scheduled} = require('../src/index');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe('test Demo usage', function () {
  test('test getting queue data', async () => {
    const queueData = await Queue.queueData(_setupQueueConfig());
    const scheduledData = await Queue.scheduledData(_setupQueueConfig());
    expect(queueData).toEqual(_getQueueResult());
    expect(scheduledData).toEqual({'scheduledJobs': 0});
  });
  test('test queueStats', async () => {
    const queueData = await Queue.queueData(_setupQueueConfig());
    const scheduledData = await Queue.scheduledData(_setupQueueConfig(), {includeJobDetails: true});
    expect(queueData).toEqual(_getQueueResult());
    expect(scheduledData).toEqual({'scheduledJobs': 0, scheduledJobsDetails: []});
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