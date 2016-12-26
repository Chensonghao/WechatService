'use strict';
const Promise = require('bluebird');
const util = require('../util');
const config = require('../../config');
/*
管理与微信接口交互，票据验证更新
*/
function TokenManagement() {
    const _this = this;
    this.opts = config.wechat;
    this.fetchAccessToken();
}
TokenManagement.prototype = {
    /*
    更新token
    */
    updateAccessToken() {
        const opts = this.opts;
        const url = opts.accessTokenUrl(opts.appID, opts.appSecret);
        return util.request({
            method: 'GET',
            url
        }).then(data => {
            const now = new Date().getTime();
            //新的过期时间，微信票据强制两小时过期，这里提前20s用于防止网络延迟等情况
            data.expires_in = now + (data.expires_in - 20) * 1000;
            return Promise.resolve(data);
        });
    },
    /*
    验证token是否过期
    */
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        const access_token = data.access_token;
        const expires_in = data.expires_in;
        const now = new Date().getTime();
        return now < expires_in;
    },
    /*获取当前可用的access_token*/
    fetchAccessToken() {
        let _this = this;
        let opts = this.opts;
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
        return opts.getAccessToken().then(function(data) {
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
        }).then(data => {
            _this.access_token = data.access_token;
            _this.expires_in = data.expires_in;
            opts.saveAccessToken(data);
            return Promise.resolve(data);
        });
    }
};
const instance = new TokenManagement();

module.exports = instance;
