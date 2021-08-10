# node-resque-ui


this package is to be used in conjunction with node-resque being used with express.

Usage:


```
const queue = require('node-resque-express-ui')

const config = {
  queues: ['nameOfQueue1', 'nameOfQueue2', 'nameOfQueue3', ....],
};

# use with express middleware `use` function
app.use('/some-route', queue.serve, queue.setup(config));
```

###Config fields:

Configuring the connection and queue names

- **queues:** Required field. An array of strings consisting of queue names
- **namespace:** Optional field. Defaults to 'resque' if not included. Should be the same as the namespace used with node-resque
- **host:** Optional field. Defaults to 'localhost' if not included.
- **port:** Optional field. Defaults to '6379' if not included.
- **password:** Optional field (if no password used)
- **family:** Optional field. Accepted values 4 or 6 (IPv4 or IPv6 respectively)
- **db:** Optional field. Redis DB number, i.e 0, 1, 2, etc...


Custom settings:

Custom settings can be added by passing a second parameter into the `setup` function.

```

const customConf = {
    customTitle: 'Your Custom title',
    customHeader: 'Your Custom header value',
};

app.use('/some-route', queue.serve, queue.setup(config, customConf));
```

Custom settings fields:

- **rawJSON:** boolean field, that determines if the page displays a raw JSON display of queue lengths or a visual display.
- **customTitle:** Allows you to customise the browser tab title
- **customHeader:** Allows you to customise the text shown in the header

###Custom Css

Custom CSS can be added by passing a third parameter into the `setup` function.

This will allow you to totally change the look and feel of the UI

```
const custumCss = `
  body {
    color: red;
    font-size: 100px;
  };
`;

app.use('/queue-up', queue.serve, queue.setup(queueUiConfig, {}, custumCss));
```

