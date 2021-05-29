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
