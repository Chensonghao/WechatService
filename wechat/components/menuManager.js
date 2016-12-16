'use strict';
const config = require('../../config/config');
const tokenManager = require('./tokenManager');
const util = require('../util');
const menu = config.wechat.menu;
const requestByToken = util.requestByToken;

/*创建菜单*/
exports.createMenu = () => {
    return requestByToken({
        method: 'POST',
        body: {
            "button": [{
                "type": "click",
                "name": "今日歌曲",
                "key": "V1001_TODAY_MUSIC"
            }, {
                "name": "菜单",
                "sub_button": [{
                    "type": "view",
                    "name": "搜索",
                    "url": "http://www.soso.com/"
                }, {
                    "type": "click",
                    "name": "赞一下我们",
                    "key": "V1001_GOOD"
                }, {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }]
            }, {
                "name": "服务",
                "sub_button": [{
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "rselfmenu_0_0",
                }, {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    "key": "rselfmenu_0_1",
                }, {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_11"
                }, {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_12"
                }, {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_21"
                }]
            }]
        }
    }, menu.createMenuUrl);
};
/*查询菜单,只能查到使用api配置的菜单*/
exports.getMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menu.getMenuUrl);
};
/*查询菜单,api配置的菜单或网站功能发布的菜单都能查到*/
exports.getAllMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menu.getAllMenuUrl);
};
/*删除菜单*/
exports.deleteMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menu.deleteMenuUrl);
};
