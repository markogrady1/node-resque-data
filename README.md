# node-resque-data


this module can be used to grab node-resque data such as queue lengths and the number of scheduled jobs outstanding.

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
  port: 6379, // Optional - defaults to 6379
  host: 'localhost', // Optional - defaults to 'localhost'
  password: "redis-pw",
  db: 0, // Optional - defaults to 0
  family: 4, // Optional - defaults to 4 for IPv4 or 6 for IPv6
  queues: ['nameOfQueue1', 'nameOfQueue2', 'nameOfQueue3'],
  namespace: 'beepbop', // Optional - defaults to 'resque'
};

const result = await queue.queueData(config);
console.log(result)
```

example output

```javascript
[
  { queue: 'nameOfQueue1', num: 1 },
  { queue: 'nameOfQueue2', num: 23 },
  { queue: 'nameOfQueue3', num: 0 },
]
```

view queue information using `.then`

```javascript
queue.queueData(config).then((result) => {
  console.log(result)
});
```

view schedule information

```javascript
const result = await Queue.scheduledData(config);
console.log(result)
```
Example output:

```javascript
{
  scheduledJobs: 2
}
```
include more information about the scheduled jobs

```javascript
const options = {
  includeJobDetails: true
};

const result = await Queue.scheduledData(config, options);
console.log(result)
```
Example output:

```javascript
{
  scheduledJobs: 2,
  scheduledJobsDetails: [
    {
      class: 'subtract',
      queue: 'math',
      args: [ 2, 1 ],
      runTime: 2021-08-15T19:36:27.000Z
   }
  ]
}
```


### integrate node-resque-data with express middleware

The below snippet will display the same example output displayed above but this time to an express route you specify.

```javascript
const queue = require('node-resque-data')

const config = {
  queues: ['nameOfQueue1', 'nameOfQueue2', 'nameOfQueue3'],
};

const options = {
  rawJSON: true
};

// add route via express middleware
app.use('/some-route', queue.serve, queue.setup(config, options));
```

### Visualise node-resque data

To acheive this simply remove the `{rawJSON: true}` object from the `queue.setup` function or even set it to `false`

This will display the node-resque queue data in a bar and pie chart.

### Custom options:

Custom settings can be added by passing additional keys into the `options` object.

```javascript
const options = {
  rawJSON: false,
  customTitle: 'Your Custom title',
  customHeader: 'Your Custom header value',
};

app.use('/some-route', queue.serve, queue.setup(config, options));
```

Custom option fields:

- `rawJSON`: boolean field, that determines if the page displays a raw JSON display of queue lengths or a visual display.
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
