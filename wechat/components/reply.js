'use strict';
const template = require('./template');
const config = require('../../config');
const materialManager = require('./material');
const userManager = require('./user');
const path = require('path');
/*
被动消息回复模块
*/
module.exports = async(ctx, next) => {
    const message = ctx.msg;
    const createTime = new Date().getTime();
    const fromUserName = message.FromUserName;
    const toUserName = message.ToUserName;
    let params = {
        createTime,
        fromUserName: toUserName,
        toUserName: fromUserName,
        msgType: 'text'
    };
    if (message.MsgType === 'event') {
        //用户关注
        if (message.Event === 'subscribe') {
            params.content = config.reply.subscribe;
            ctx.body = template(params);
            //扫二维码关注，二维码的参数值
            if (message.EventKey) {
                console.log(`扫二维码进来：${message.EventKey},${message.Ticket}可获取二维码图片。`);
            }
        }
        //用户取消关注
        else if (message.Event === 'unsubscribe') {
            console.log('取消关注');
        }
        //上报地理位置
        else if (message.Event === 'LOCATION') {
            params.content = `您的地理位置${message.Latitude}/${message.Longitude}-message.Precision`;
            ctx.body = template(params);
        }
        //点击菜单
        else if (message.Event === 'CLICK') {
            params.content = `您点击了菜单：${message.EventKey}`;
            ctx.body = template(params);
        }
        //扫描
        else if (message.Event === 'scancode_waitmsg') {
            console.log(`扫码等回复：${message.EventKey}`);
            console.log(message.ScanCodeInfo);
        }
        //视图
        else if (message.Event === 'VIEW') {
            params.content = `您点击了菜单：${message.EventKey}`;
            ctx.body = template(params);
            console.log(`您点击了菜单中的链接：${message.EventKey}`);
        }
        //群发结果事件推送
        else if (message.Event === 'MASSSENDJOBFINISH') {
            const msgId = message.MsgID;
            switch(message.Status){
                case 'send success':
                break;
                case 'send fail':
                break;
            }
        }
    }
    //文本信息
    else if (message.MsgType === 'text') {
        const msgContent = message.Content;
        let reply = `听不懂你说的：${msgContent}`;
        if (msgContent === '1') {
            params.msgType = 'image';
            params.mediaId = 'cz0q5TUzFK48i0lUy7uy8k60kjrIS2dKQb2QHnP7wZU';
        } else if (msgContent === '2') {
            params.msgType = 'music';
            params.thumbMediaId = 'cz0q5TUzFK48i0lUy7uy8q2BMpOsu0Jeo_Lm1cB73Fo';
            params.title = '音乐内容';
            params.desc = '放松以下';
            params.musicUrl = 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3';
        } else if (msgContent === '3') {
            params.msgType = 'news';
            params.articles = [{
                title: '百度',
                desc: '百度首页',
                picUrl: 'https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/super/crop=0,0,1920,1200/sign=ff9e9f12533d26973a9c521d68cb9ecb/024f78f0f736afc326439dbdb119ebc4b645129e.jpg',
                url: 'https://www.baidu.com/'
            }, {
                title: '中商船撞韩渔船',
                desc: '中国商船撞韩渔船后逃逸',
                picUrl: 'http://p0.ifengimg.com/a/2016_51/86ebf03c4597926_size257_w550_h330.jpg',
                url: 'http://news.ifeng.com/a/20161214/50414402_0.shtml'
            }, {
                title: 'IS夺回叙利亚重镇巴尔米拉',
                desc: 'IS夺回叙利亚重镇巴尔米拉 俄指责称美国停火所致',
                picUrl: 'http://p1.ifengimg.com/fck/2016_51/5a0368e4e5acc84_w899_h600.jpg',
                url: 'http://news.ifeng.com/a/20161213/50409594_0.shtml'
            }]
        } else if (msgContent === '4') {
            params.msgType = 'video';
            params.mediaId = 'cz0q5TUzFK48i0lUy7uy8pSf21W0zKQ-JnxBAX8vYT8';
            params.title = '视频';
            params.desc = '视频短片';
        } else if (msgContent === '5') {
            const res = await materialManager.getMaterialCount();
            reply = JSON.stringify(res);
        } else if (msgContent === '0') {
            const res = await userManager.getAllUserList();
            console.log(res);
        } else if(msgContent === '6'){
            const menu = require('./menu');
            const res = await menu.createMenu();
            console.log(res);
        }
        params.content = reply;
        ctx.body = template(params);
    }
    await next();
}
