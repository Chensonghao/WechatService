/*消息群发管理模块*/
'use strict';
const Promise = require('bluebird');
const config = require('../../config');
const tokenManager = require('./token');
const util = require('../util');
const mass = config.wechat.mass;
const requestByToken = util.requestByToken;

/*根据群组群发，如果没有传group_id，则向所有用户群发*/
exports.sendByGroup = (msgtype, message, group_id) => {
    let body = {
        filter: {
            is_to_all: true
        },
        msgtype
    };
    body[msgtype] = message;
    if (group_id) {
        body.filter.group_id = group_id;
        body.filter.is_to_all = false;
    }
    return requestByToken({
        method: 'POST',
        body
    }, mass.sendByGroupUrl);
};

/*根据openID群发*/
exports.sendByOpenId = (msgtype, message, openids) => {
    let body = {
        touser: openids,
        msgtype
    };
    body[msgtype] = message;
    return requestByToken({
        method: 'POST',
        body
    }, mass.sendByOpenIdUrl);
};
/*预览群发，群发前发给指定用户预览一下,每天100次限制*/
exports.previewMsg = (msgtype, message, openid) => {
    let body = {
        touser: openid,
        msgtype
    };
    body[msgtype] = message;
    return requestByToken({
        method: 'POST',
        body
    }, mass.previewUrl);
};
/*删除群发，只能在半小时内删除,只能删除图文和视频*/
exports.deleteMsg = msg_id => {
    return requestByToken({
        method: 'POST',
        body: {
            msg_id
        }
    }, mass.deleteUrl);
};
/*查询群发状态*/
exports.check = msg_id => {
    return requestByToken({
        method: 'POST',
        body: {
            msg_id
        }
    }, mass.checkUrl).then(result =>{
        if(result && result.msg_status === 'SEND_SUCCESS'){
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    });
};
