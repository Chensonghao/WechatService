/*用户管理模块*/
'use strict';
const Promise = require('bluebird');
const config = require('../../config');
const tokenManager = require('./token');
const util = require('../util');
const group = config.wechat.group;
const requestByToken = util.requestByToken;
let openidList = [];
/*
创建用户分组
*/
exports.createGroup = name => {
    return requestByToken({
        method: 'POST',
        body: {
            group: {
                name
            }
        }
    }, group.createGroupUrl);
};
/*
查询所有分组
*/
exports.queryGroups = () => {
    return requestByToken({
        method: 'GET'
    }, group.queryGroupsUrl);
};
/*
查询用户所在分组
*/
exports.queryUserGroup = openid => {
    return requestByToken({
        method: 'POST',
        body: {
            openid
        }
    }, group.queryUserGroupUrl);
};
/*
修改分组名
*/
exports.modifyGroupName = (id, name) => {
    return requestByToken({
        method: 'POST',
        body: {
            group: {
                id,
                name
            }
        }
    }, group.modifyGroupNameUrl);
};
/*
移动用户分组/批量移动用户分组
批量移动openid数组长度不能超过50
*/
exports.moveGroup = (openid, to_groupid) => {
    let body = {
        to_groupid
    };
    let urlFunc = group.moveGroupUrl;
    if (Object.prototype.toString.call(openid) === '[object Array]') {
        body.openid_list = openid;
        urlFunc = group.batchMoveGroupUrl
    } else {
        body.openid = openid;
    }
    return requestByToken({
        method: 'POST',
        body
    }, urlFunc);
};
/*
删除用户分组
*/
exports.removeGroup = id => {
    return requestByToken({
        method: 'POST',
        body: {
            group: {
                id
            }
        }
    }, group.removeGroupUrl);
};
/*
设置用户备注名：目前只对微信认证的服务号开放
*/
exports.remark = (openid, remark) => {
    return requestByToken({
        method: 'POST',
        body: {
            openid,
            remark
        }
    }, group.remarkUrl);
};
/*
获取用户基本信息/批量获取openid数组最多一次100条
*/
exports.getUserInfo = openid => {
    let arr = [];
    let reqParam = {};
    if (Object.prototype.toString.call(openid) === '[object Array]') {
        reqParam.method = 'POST';
        reqParam.body = {
            user_list: []
        };
        openid.forEach(id => {
            reqParam.body.user_list.push({
                openid: id,
                lang: 'zh-CN'
            });
        });
    } else {
        arr.push(openid);
        reqParam.method = 'GET';
    }
    return requestByToken(reqParam, group.userInfoUrl, arr);
};
/*
获取关注者列表,一次最多拉去10000个,next_openid第一个拉取的用户openid,不填默认从头开始拉
*/
exports.getUserList = getUserList;
/*
递归获取所有关注者列表
*/
exports.getAllUserList = () => {
    openidList = [];
    return getUserList().then(dealGetAll);
}

function getUserList(next_openid) {
    return requestByToken({
        method: 'GET'
    }, group.userListUrl, [next_openid || '']);
}

function dealGetAll(res) {
    let returnData = () => {
        const len = openidList.length;
        res.data = {
            openid: openidList
        };
        res.total = len;
        res.count = len;
        return Promise.resolve(res);
    };
    if (!res.data || !res.data.openid || Object.ptototype.toString(res.data.openid) !== '[object Array]') {
        returnData();
    }
    openidList = openidList.concat(res.data.openid);
    if (res && res.total > openidList.length && res.next_openid) {
        return getUserList(res.next_openid).then(dealGetAll);
    } else {
        returnData();
    }
}
