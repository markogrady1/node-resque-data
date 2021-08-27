const { Queue, Scheduled } = require('../src/index');

const request = require('supertest');
const express = require('express');

jest.mock('ioredis', () => require('ioredis-mock/jest'));

const config = {
  queues: ['beepbop', 'robot']
}

test('middleware raw route works', done => {
  const app = express();
  app.use('/', Queue.serve, Queue.setup(config, {
    rawJSON: true
  }));

  request(app)
    .get('/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({
      queues: [{
        queue: 'beepbop',
        num: 0
      }, {
        queue: 'robot',
        num: 0
      }],
      jobs: {
        processed: null,
        failed: null,
        failing: 0
      }
    })
    .expect(200, done);
});