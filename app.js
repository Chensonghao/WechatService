'use strict';
const koa = require('koa');
const wechat = require('./wechat/g');
const path = require('path');
const util = require('./libs/util');
const wechat_file = path.join(__dirname,'./config/wechat.txt');
const config = {
    wechat: {
        appID: 'wx6ca0cdfea611e0d2',
        appSecret: 'efaf8f6beb08b10f94bcb575c9b29478',
        token: 'chensonghao',
        getAccessToken(){
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        }
    }
};

var app = new koa();
/*
微信配置信息验证
*/
app.use(wechat(config.wechat));
app.listen(3100);
console.log('listening on port : 3100');
