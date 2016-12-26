'use strict';
const xml2js = require('xml2js');
const Promise = require('bluebird');
const req = Promise.promisify(require('request'));
const tokenManager = require('./components/token');
const log = require('cshlog');

exports.parseXMLAsync = xml => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {
            trim: true
        }, (err, content) => {
            if (err) {
                log.error('parseXMLAsync error!');
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
};

function formatMessage(result) {
    let message = {};
    if (typeof result === 'object') {
        let keys = Object.keys(result);
        keys.forEach(key => {
            let item = result[key];
            if (Object.prototype.toString.call(item) === '[object Array]' && item.length > 0) {
                if (item.length === 1) {
                    let value = item[0];
                    if (typeof value === 'object') {
                        message[key] = formatMessage(value);
                    } else {
                        message[key] = (value || '').trim();
                    }
                } else {
                    message[key] = [];
                    item.forEach(subitem => {
                        message[key].push(formatMessage(subitem));
                    });
                }
            }
        });
    }
    return message;
}
exports.formatMessage = formatMessage;
exports.request = params => {
    return new Promise((resolve, reject) => {
        if (params.json === undefined) {
            params.json = true;
        }
        req(params).then(resdata => {
            let body = resdata.body;
            if (body) {
                if (body.errcode && body.errcode !== 0) {
                    throw new Error(JSON.stringify({
                        request: params,
                        errcode: body.errcode,
                        errmsg: body.errmsg
                    }));
                } else {
                    log.info(JSON.stringify({
                        request: params,
                        status: 200
                    }));
                    resolve(body);
                }
            } else {
                throw new Error(`${params.url}:请求失败！`);
            }
        }).catch(err => {
            log.error(err.toString());
            reject(err);
        });
    });
};
exports.requestByToken = (reqParam, getUrl, paramsArr) => {
    return new Promise((resolve, reject) => {
        tokenManager.fetchAccessToken().then(data => {
            reqParam = reqParam || {};
            if (getUrl && (typeof getUrl === 'function')) {
                paramsArr = paramsArr || [];
                paramsArr.unshift(data.access_token);
                reqParam.url = getUrl.apply(null, paramsArr);
            }
            if (reqParam.json === undefined) {
                reqParam.json = true;
            }
            if (reqParam.formData) {
                reqParam.formData.access_token = data.access_token;
            }
            req(reqParam).then(resdata => {
                let body = resdata.body;
                if (body) {
                    if (body.errcode && body.errcode !== 0) {
                        throw new Error(JSON.stringify({
                            request: reqParam,
                            errcode: body.errcode,
                            errmsg: body.errmsg
                        }));
                    } else {
                        log.info(JSON.stringify({
                            request: reqParam,
                            status: 200
                        }));
                        resolve(body);
                    }
                } else {
                    throw new Error(`${reqParam.url}:请求失败！`);
                }
            }).catch(err => {
                log.error(err.toString());
                reject(err);
            });
        });
    });
}
