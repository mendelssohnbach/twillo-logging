# ガイド: Node.jsでログを記録する方法

[Blog](https://www.twilio.com/blog/a-guide-to-node-js-logging-jp)

```shell
$ npm init -y
$ npm install express
$ npm ls
└── express@4.17.1
```

## consoleによるロギング

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

## Pinoを使ったロギング

[pino](https://getpino.io/#/)

> オーバーヘッドが非常に低い`Node.js`ロガー

[express-pino-logger](https://github.com/pinojs/express-pino-logger#readme)

> `pino`でログを記録する高速ミドルウェア。ちなみに、`express`なしでも動作します。

```shell
 $ npm i pino express-pino-logger
 $ npm ls
├── express-pino-logger@6.0.0
├── express@4.17.1
└── pino@6.11.3
```

```js
// server.js
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

// `logger`インスタンスを作成
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
// `express-pino-logger`に割当
const expressLogger = expressPino({ logger });

const PORT = process.env.PORT || 3000;
const app = express();

// 新しいロガーミドルウェアを作成
app.use(expressLogger);

app.get('/', (req, res) => {
  // `logger.debug`をルートパスに追加
  logger.debug('Calling res.send');
  res.send('Hello World');
});

app.listen(PORT, () => {
  logger.info('Server running on port %d', PORT);
});
```

```shell
$ node index.js
{"level":30,"time":1622273674142,"pid":15506,"hostname":"tiger","msg":"Server running on port 3000"}
...
```

`JSON`データが出力された。

ログレベルを変更

```shell
$ LOG_LEVEL=debug node index.js
{"level":30,"time":1622273823101,"pid":15810,"hostname":"tiger","msg":"Server running on port 3000"}
...
```

### transportsを使う

`Pino`の標準出力形式を様々に変換。`pino-pretty`を使用して、より判別しやすいバージョンのログを作成。

[pino-pretty](https://github.com/pinojs/pino-pretty#readme)

> 基本的な`ndjson`フォーマッタを提供します。

`ndjson`: 改行区切り`JSON`

```shell
$ npm i -D pino-pretty
$ npm ls
├── express-pino-logger@6.0.0
├── express@4.17.1
├── pino-pretty@5.0.1
└── pino@6.11.3
```

```shell
$ LOG_LEVEL=debug node index.js | npx pino-pretty
[1622274547823] INFO (16587 on tiger): Server running on port 3000
[1622274553038] DEBUG (16587 on tiger): Calling res.send
[1622274553074] INFO (16587 on tiger): request completed
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        ...
      },
      "remoteAddress": "::1",
      "remotePort": 50382
    }
    res: {
      "statusCode": 304,
      "headers": {
        "x-powered-by": "Express",
        "etag": "W/\"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA\""
      }
    }
    responseTime: 37
```

重要な情報が色分けされた。


