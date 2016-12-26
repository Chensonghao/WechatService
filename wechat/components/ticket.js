'use strict';
const Promise = require('bluebird');
const util = require('../util');
const config = require('../../config');
const wechatConfig = config.wechat;
const crypto = require('crypto');
const token = require('./token');

/*
更新ticket
*/
function updateTicket(access_token) {
    const url = wechatConfig.ticketUrl(access_token, 'jsapi');
    return util.request({
        method: 'GET',
        url
    }).then(data => {
        const now = new Date().getTime();
        //新的过期时间，微信票据强制两小时过期，这里提前20s用于防止网络延迟等情况
        data.expires_in = now + (data.expires_in - 20) * 1000;
        return Promise.resolve(data);
    });
}
/*
验证ticket是否过期
*/
function isValidTicket(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    const now = new Date().getTime();
    return now < data.expires_in;
}

//生成随机字符串
let createNonce = () => {
    return Math.random().toString(36).slice(2);
};
//生成时间戳
let createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000, 10) + '';
};
//生成签名
let getSignature = (noncestr, timestamp, ticket, url) => {
    const params = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ];
    const str = params.sort().join('&');
    const shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
};
/*获取当前可用的ticket*/
function fetchTicket(access_token) {
    return wechatConfig.getTicket().then(function(data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return updateTicket(access_token);
        }
        if (isValidTicket(data)) {
            return Promise.resolve(data);
        } else {
            return updateTicket(access_token);
        }
    }).then(data => {
        wechatConfig.saveTicket(data);
        return Promise.resolve(data);
    });
}
//签名算法
function signTicket(ticket, url) {
    const noncestr = createNonce();
    const timestamp = createTimestamp();
    const signature = getSignature(noncestr, timestamp, ticket, url);
    return {
        noncestr,
        timestamp,
        signature
    };
};
module.exports = async(ctx, next) => {
    const data = await token.fetchAccessToken();
    const access_token = data.access_token;
    const ticketData = await fetchTicket(access_token);
    const ticket = ticketData.ticket;
    const signature = signTicket(ticket, ctx.href);
    signature.appId = wechatConfig.appID;
    ctx.sign = signature;
};
