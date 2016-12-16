const path = require('path');
const wechat_file = path.join(__dirname, '../config/wechat.txt');
const util = require('../libs/util');
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
/*
微信配置信息
*/
module.exports = {
    port: 3100,
    wechat: {
        appID: 'wx6ca0cdfea611e0d2',
        appSecret: 'efaf8f6beb08b10f94bcb575c9b29478',
        token: 'chensonghao',
        /*从微信服务器获取access_token的接口地址*/
        accessTokenUrl(appID, appSecret) {
            return `${prefix}token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`;
        },
        getAccessToken() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken(data) {
            return util.writeFileAsync(wechat_file, JSON.stringify(data));
        },
        material: {
            /*临时素材上传地址*/
            temporaryUploadUrl(access_token, type) {
                return `${prefix}media/upload?access_token=${access_token}&type=${type}`;
            },
            /*永久素材上传地址*/
            permanentUploadUrl(access_token, isNews) {
                let part = isNews ? 'add_news' : 'add_material';
                return `${prefix}material/${part}?access_token=${access_token}`;
            },
            /*永久图文素材中的图片上传地址*/
            permanentPicUploadUrl(access_token) {
                return `${prefix}media/uploadimg?access_token=${access_token}`;
            },
            /*删除永久素材*/
            deleteMaterialUrl(access_token) {
                return `${prefix}material/del_material?access_token=${access_token}`;
            },
            /*更新永久图文素材*/
            updateNewsUrl(access_token) {
                return `${prefix}material/update_news?access_token=${access_token}`;
            },
            /*获取永久素材列表*/
            materialListUrl(access_token) {
                return `${prefix}material/batchget_material?access_token=${access_token}`;
            },
            materialCountUrl(access_token) {
                return `${prefix}material/get_materialcount?access_token=${access_token}`;
            }
        },
        group: {
            /*创建用户分组*/
            createGroupUrl(access_token) {
                return `${prefix}groups/create?access_token=${access_token}`;
            },
            /*查询所有分组*/
            queryGroupsUrl(access_token) {
                return `${prefix}groups/get?access_token=${access_token}`;
            },
            /*查询用户所在分组*/
            queryUserGroupUrl(access_token) {
                return `${prefix}groups/getid?access_token=${access_token}`;
            },
            /*修改分组名*/
            modifyGroupNameUrl(access_token) {
                return `${prefix}groups/update?access_token=${access_token}`;
            },
            /*移动用户分组*/
            moveGroupUrl(access_token) {
                return `${prefix}groups/members/update?access_token=${access_token}`;
            },
            /*批量移动用户分组*/
            batchMoveGroupUrl(access_token) {
                return `${prefix}groups/members/batchupdate?access_token=${access_token}`;
            },
            /*删除用户分组*/
            removeGroupUrl(access_token) {
                return `${prefix}groups/delete?access_token=${access_token}`;
            },
            /*设置用户备注名：目前只对微信认证的服务号开放*/
            remarkUrl(access_token) {
                return `${prefix}user/info/updateremark?access_token=${access_token}`;
            },
            /*获取用户基本信息*/
            userInfoUrl(access_token, openid) {
                if(openid){
                    return `${prefix}user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
                }
                return `${prefix}user/info/batchget?access_token=${access_token}`;
            },
            /*获取用户列表,next_openid不填默认从头开始拉*/
            userListUrl(access_token,next_openid){
                return `${prefix}user/get?access_token=${access_token}&next_openid=${next_openid||''}`;
            }
        },
        mass:{
            sendByGroupUrl(access_token){
                return `${prefix}message/mass/sendall?access_token=${access_token}`;
            },
            sendByOpenIdUrl(access_token){
                return `${prefix}message/mass/send?access_token=${access_token}`;
            },
            previewUrl(access_token){
                return `${prefix}message/mass/preview?access_token=${access_token}`;
            },
            deleteUrl(access_token){
                return `${prefix}message/mass/delete?access_token=${access_token}`;
            },
            checkUrl(access_token){
                return `${prefix}message/mass/get?access_token=${access_token}`;
            }
        },
        menu:{
            createMenuUrl(access_token){
                return `${prefix}menu/create?access_token=${access_token}`;
            },
            getMenuUrl(access_token){
                return `${prefix}menu/get?access_token=${access_token}`;
            },
            getAllMenuUrl(){
                return `${prefix}get_current_selfmenu_info?access_token=${access_token}`;
            },
            deleteMenuUrl(){
                return `${prefix}menu/delete?access_token=${access_token}`;
            }
        }
    }
};
