const {Queue, Scheduled} = require('../src/index');

const request = require('supertest');
const express = require('express');
const app = express();

jest.mock('ioredis', () => require('ioredis-mock/jest'));

const config = {
  queues: ['beepbop', 'robot']
}

app.use('/', Queue.serve, Queue.setup(config, {rawJSON: true}));

test('middleware raw route works', done => {
  request(app)
    .get('/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect([ { queue: 'beepbop', num: 0 }, { queue: 'robot', num: 0 } ])
    .expect(200, done);
});