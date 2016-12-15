const path = require('path');
const wechat_file = path.join(__dirname, '../config/wechat.txt');
const util = require('../libs/util');
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
/*
微信配置信息
*/
module.exports = {
    wechat: {
        appID: 'wx6ca0cdfea611e0d2',
        appSecret: 'efaf8f6beb08b10f94bcb575c9b29478',
        token: 'chensonghao',
        getAccessToken() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        },
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
        deleteMaterialUrl(access_token){
            return `${prefix}material/del_material?access_token=${access_token}`;
        },
        /*更新永久图文素材*/
        updateNewsUrl(access_token){
            return `${prefix}material/update_news?access_token=${access_token}`;
        },
        /*获取永久素材列表*/
        materialListUrl(access_token){
            return `${prefix}material/batchget_material?access_token=${access_token}`;
        },
        materialCountUrl(access_token){
            return `${prefix}material/get_materialcount?access_token=${access_token}`;
        },
        /*从微信服务器获取access_token的接口地址*/
        accessTokenUrl(appID, appSecret) {
            return `${prefix}token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`;
        }
    },
    port: 3100
};
