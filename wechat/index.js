'use strict';

const sha1 = require('sha1');
const rawBody = require('raw-body');
const util = require('./util');
const replyManager = require('./components/reply');
/*
微信配置信息验证中间件
*/
module.exports = (opts) => {
    return async(ctx, next) => {
        const nonce = ctx.query.nonce;
        const signature = ctx.query.signature;
        const timestamp = ctx.query.timestamp;
        const echostr = ctx.query.echostr;
        const str = [opts.token, timestamp, nonce].sort().join('');
        const sha = sha1(str);
        //微信配置信息验证
        if (ctx.method === 'GET') {
            if (sha === signature) {
                ctx.body = echostr + '';
            } else {
                ctx.body = 'wrong';
            }
        }
        //消息推送
        else if (ctx.method === 'POST') {
            if (sha !== signature) {
                ctx.body = 'wrong';
                return false;
            }
            const data = await rawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset
            });
            const content = await util.parseXMLAsync(data);
            const message = util.formatMessage(content.xml);
            ctx.msg = message;
            ctx.status = 200;
            ctx.type = 'application/xml';
            await replyManager(ctx, next);
        }
    };
}
