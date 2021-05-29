# ガイド: Node.jsでログを記録する方法

[Blog](https://www.twilio.com/blog/a-guide-to-node-js-logging-jp)

```shell
$ npm init -y
$ npm install express
$ npm ls
└── express@4.17.1
```

[util.format(format[, ...args])](https://nodejs.org/dist/latest-v14.x/docs/api/util.html)


- %s: String
- %d: Number
- %i: parseInt
- %f: parseFloat
- %j: JSON
- %o: Object
- %O: Object
- %c: CSS
- %%: single percent

```js
// server.js
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

app.use((req, res, next) => {
  console.log('%s', req); // %o:オブジェクト全体
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('Server running on port %d', PORT);
});
```

```shell
$ node index.js
...
    [Symbol(kOutHeaders)]: [Object: null prototype] { 'x-powered-by': [Array] }
  },
  [Symbol(kCapture)]: false,
  [Symbol(RequestTimeout)]: undefined
}
```

```js
// server.js
app.use((req, res, next) => {
  console.log('%s', req); // %o:オブジェクト全体
  next();
});
```

```shell
$ node index.js
Server running on port 3000
IncomingMessage {
  _readableState: [ReadableState],
  _events: [Object: null prototype],
  _eventsCount: 1,
  ...
  [Symbol(kCapture)]: false,
  [Symbol(RequestTimeout)]: undefined
}
```
