'use strict';

const sha1 = require('sha1');
const Wechat = require('./wechat');
const rawBody = require('raw-body');
const util = require('./util');
const template = require('./template');
/*
微信配置信息验证中间件
*/
module.exports = opts => {
    var wechat = new Wechat(opts);
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

            const fromUserName = message.FromUserName;
            const toUserName = message.ToUserName;
            //用户关注
            if(message.MsgType==='event' && message.Event ==='subscribe'){
                const now = new Date().getTime();
                ctx.status = 200;
                ctx.type = 'application/xml';
                const returnMsg = template.textMsg(fromUserName,toUserName,now,'欢迎来到汽车金融服务号！\n\n 1、查询\n 2、帮助');
                console.log(returnMsg);
                ctx.body = returnMsg;
                return;
            }
            //用户取消关注
            if(message.MsgType==='event' && message.Event ==='unsubscribe'){

            }
            //文本信息
            if(message.MsgType==='text'){
                const msgContent = message.content;
            }
            console.log(message);
        }
    };
}
