'use strict';
const menu = require('./configs/menu.config');
const wechat = require('./configs/wechatAPI.config');
/*
微信配置信息
*/
module.exports = {
    port: 3100,
    reply: {
        subscribe: '欢迎关注平安养老汽融公众号，现在完成验证身份即可免费开通以下功能：\n\n1、查询车贷信息；\n2、查询保险信息；\n3、享受第三方服务。\n\n<a href="https://www.baidu.com/">点击立即验证身份</a>'
    },
    wechat,
    menu
};
