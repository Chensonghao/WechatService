'use strict';
const config = require('../../config');
const util = require('../util');
const menuApi = config.wechat.menu;
const menu = config.menu;
const conditionalMenuApi = config.wechat.conditionalMenu;
const requestByToken = util.requestByToken;

/*创建菜单*/
exports.createMenu = () => {
    return requestByToken({
        method: 'POST',
        body: menu.def
    }, menuApi.createMenuUrl);
};
/*查询菜单,只能查到使用api配置的菜单,包括个性化菜单*/
exports.getMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menuApi.getMenuUrl);
};
/*查询菜单,api配置的菜单或网站功能发布的菜单都能查到*/
exports.getAllMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menuApi.getAllMenuUrl);
};
/*删除全部菜单－包括个性化菜单*/
exports.deleteMenu = () => {
    return requestByToken({
        method: 'GET'
    }, menuApi.deleteMenuUrl);
};
/*创建个性化菜单*/
exports.createConditionalMenu = menuForm => {
    return requestByToken({
        method: 'POST',
        body: menuForm
        // {
        //     "button": [{
        //         "type": "click",
        //         "name": "今日歌曲",
        //         "key": "V1001_TODAY_MUSIC"
        //     }, {
        //         "name": "菜单",
        //         "sub_button": [{
        //             "type": "view",
        //             "name": "搜索",
        //             "url": "http://www.soso.com/"
        //         }, {
        //             "type": "view",
        //             "name": "视频",
        //             "url": "http://v.qq.com/"
        //         }, {
        //             "type": "click",
        //             "name": "赞一下我们",
        //             "key": "V1001_GOOD"
        //         }]
        //     }],
        //     "matchrule": {
        //         "group_id": "2"
        //     }
        // }
    }, conditionalMenuApi.createMenuUrl);
};
/*删除个性化菜单*/
exports.deleteConditionalMenu = menuid => {
    return requestByToken({
        method: 'POST',
        body: {
            menuid
        }
    }, conditionalMenuApi.deleteMenuUrl);
};
