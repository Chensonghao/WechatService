'use strict';
const koa = require('koa');
const wechat = require('./wechat/');
const config = require('./config/config');

var app = new koa();

app.use(wechat(config.wechat));
app.listen(config.port);
console.log(`^_^ Server is listening on port : ${config.port} ^_^`);
