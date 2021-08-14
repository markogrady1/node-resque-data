# node-resque-data


this module can be used to grab node-resque data such as queue lengths.

It can also be used to visualise node-resque data via express middleware.

### Installation

```
npm install node-resque-data
```

### Usage:

View raw queue information


```javascript
const queue = require('node-resque-data')

const config = {
  queues: ['nameOfQueue1', 'nameOfQueue2', 'nameOfQueue3'],
};
```
### Config fields:

Configuring the connection and queue names

- `queues`: Required field. An array of strings consisting of queue names
- `namespace`: Optional field. Defaults to 'resque' if not included. Should be the same as the namespace used with node-resque
- `host`: Optional field. Defaults to 'localhost' if not included.
- `port`: Optional field. Defaults to '6379' if not included.
- `password`: Optional field (if no password used)
- `family`: Optional field. Accepted values 4 or 6 (IPv4 or IPv6 respectively)
- `db`: Optional field. Redis DB number, i.e 0, 1, 2, etc..

using async/await

```javascript
const result = await queue.queueData(config);
console.log(result)
```
using .then to resolve the promise

```javascript
queue.queueData(config).then((result) => {
  console.log(result)
});
```
example output

```javascript
[
  { queue: 'nameOfQueue1', num: 1 },
  { queue: 'nameOfQueue2', num: 23 },
  { queue: 'nameOfQueue3', num: 0 },
]
```

### using node-resque-data with express middleware

The below snippet will display the same example output displayed above but this time to an express route you specify.

```javascript
const queue = require('node-resque-data')

const config = {
  queues: ['nameOfQueue1', 'nameOfQueue2', 'nameOfQueue3'],
};

// use with express middleware `use` function
app.use('/some-route', queue.serve, queue.setup(config, {rawJSON: true}));
```

### Visualise node-resque data

To acheive this simply remove the `{rawJSON: true}` object from the `queue.setup` function or even set it to `false`

This will display the node-resque queue data in a bar and pie chart.

### Custom settings:

Custom settings can be added by passing a second parameter into the `setup` function.

```javascript
const customConf = {
    customTitle: 'Your Custom title',
    customHeader: 'Your Custom header value',
};

app.use('/some-route', queue.serve, queue.setup(config, customConf));
```

Custom settings fields:

- `rawJSON`: boolean field, that determines if the page displays a raw JSON display of queue lengths or a visual display.
- `includeScheduledJobs`: boolean field, that determines if the output includes the number of sheduled delayed jobs.
- `customTitle`: Allows you to customise the browser tab title
- `customHeader`: Allows you to customise the text shown in the header

### Custom Css

Custom CSS can be added by passing a third parameter into the `setup` function.

This will allow you to totally change the look and feel of the UI

```javascript
const customCss = `
  body {
    color: red;
    font-size: 100px;
  };
`;

app.use('/queue-up', queue.serve, queue.setup(queueUiConfig, {}, customCss));
```

### Run tests

```
npm run test
```

### Run eslint

display linting warnings and errors

```
npm run lint
```

fix linting warnings and errors

```
npm run lint:fix
```




