const config = require('../../config');
const util = require('../util');
const qrCodeApi = config.wechat.qrCode;
/*
用于生成二维码的链接太长而印象扫码效率，可以用此方法先生成短链接再生成二维码
*/
exports.getShortUrl = long_url => {
    return util.requestByToken({
        method: 'POST',
        body: {
            action: 'long2short',
            long_url
        }
    }, qrCodeApi.shortUrl);
};
/*
生成二维码
*/
exports.createQrCode = (scene_id, expire_seconds) => {
    const action_name = expire_seconds ? 'QR_SCENE' : 'QR_LIMIT_SCENE';
    let body = {
        action_info: {
            scene: {}
        }
    };
    if (expire_seconds) {
        body.action_name = 'QR_SCENE';
        body.expire_seconds = expire_seconds;
    } else {
        body.action_name = 'QR_LIMIT_SCENE';
    }
    const sceneType = typeof scene_id;
    if (!expire_seconds && sceneType === 'string') {
        body.action_info.scene.scene_str = scene_id;
    } else if (sceneType === 'number') {
        body.action_info.scene.scene_id = scene_id;
    }
    return util.requestByToken({
        method: 'POST',
        body
    }, qrCodeApi.createQrCodeUrl);
};
/*
根据生成二维码返回的ticket获取二维码
*/
exports.getQrCode = ticket => {
    const url = qrCodeApi.createQrCodeUrl(encodeURI(ticket));
    return util.request({
        method: 'GET',
        url
    });
};
