'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: `${prefix}token?grant_type=client_credential`
}
/*
管理与微信接口交互，票据验证更新
*/
function Wechat(opts) {
    const _this = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    opts.getAccessToken().then(function(data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return _this.updateAccessToken();
        }
        if (_this.isValidAccessToken(data)) {
            return Promise.resolve(data);
        } else {
            return _this.updateAccessToken();
        }
    }).then(opts.saveAccessToken);
}
Wechat.prototype = {
    updateAccessToken() {
        const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`;
        return new Promise((resolve, reject) => {
            request({
                url,
                json: true
            }).then(data => {
                let body = data.body;
                const now = new Date().getTime();
                //新的过期时间，微信票据强制两小时过期，这里提前20s用于防止网络延迟等情况
                body.expires_in = now + (body.expires_in - 20) * 1000;
                resolve(body);
            });
        });
    },
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        const access_token = data.access_token;
        const expires_in = data.expires_in;
        const now = new Date().getTime();
        return now < expires_in;
    }
};
module.exports = Wechat;
