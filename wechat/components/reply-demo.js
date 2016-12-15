'use strict';
const template = require('./template');
const config = require('../../config/config');
const Wechat = require('../wechat');
const wechat = new Wechat(config.wechat);
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
            params.content = '欢迎来到汽车金融服务号！\n\n1、查询\n2、帮助\n3、图文';
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
        else if (message.Event === 'SCAN') {
            console.log(`扫二维码：${message.EventKey},${message.Ticket}`);
        }
        //视图
        else if (message.Event === 'VIEW') {
            params.content = `您点击了菜单中的链接：${message.EventKey}`;
            ctx.body = template(params);
        }
    }
    //文本信息
    else if (message.MsgType === 'text') {
        const msgContent = message.Content;
        let reply = `听不懂你说的：${msgContent}`;
        if (msgContent === '1') {
            reply = '查询不到';
        } else if (msgContent === '2') {
            reply = '无需帮助';
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
            //上传永久图片
            let uploadRes = await wechat.uploadMaterial('image', path.join(__dirname, '../../resource/2.jpg'), true);
            console.log(uploadRes);
            params.msgType = 'image';
            params.mediaId = uploadRes.media_id;
        } else if (msgContent === '5') {
            let uploadRes = await wechat.uploadMaterial('image', path.join(__dirname, '../../resource/1.jpg'));
            params.msgType = 'music';
            params.thumbMediaId = uploadRes.media_id;
            params.title = '音乐内容';
            params.desc = '放松以下';
            params.musicUrl = 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3';
        } else if (msgContent === '6') {
            //上传临时视频
            let uploadRes = await wechat.uploadMaterial('video', path.join(__dirname, '../../resource/1.mp4'));
            params.msgType = 'video';
            params.mediaId = uploadRes.media_id;
            params.title = '视频';
            params.desc = '测试上传临时视频';
        } else if (msgContent === '7') {
            //上传永久视频
            let uploadRes = await wechat.uploadMaterial('video', path.join(__dirname, '../../resource/1.mp4'),{
                title: '上传永久视频',
                introduction: '永久视频介绍'
            });
            params.msgType = 'video';
            params.mediaId = uploadRes.media_id;
            params.title = '视频';
            params.desc = '测试上传永久视频';
        } else if (msgContent === '8') {
            //上传永久图文资源所需的图片
            let uploadRes = await wechat.uploadMaterial('pic', path.join(__dirname, '../../resource/2.jpg'));
            console.log(uploadRes);
            params.msgType = 'news';
            params.articles = [{
                title: '永久图文信息的图片',
                desc: '永久图文信息的图片-desc',
                picUrl: uploadRes.url,
                url: 'https://www.baidu.com/'
            }]
        } else if (msgContent === '9') {
            //查询永久素材
            let list = await wechat.getMaterialList({
                type: 'image',
                offset: 0,
                count: 20
            });
            console.log(list);
        }
        params.content = reply;
        ctx.body = template(params);
    }
    await next;
}
