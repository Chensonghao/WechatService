/*
素材管理模块
*/
'use strict';
const config = require('../../config/config');
const fs = require('fs');
const tokenManager = require('./tokenManager');
const util = require('../util');
const opts = config.wechat;
const requestByToken = util.requestByToken;
/*
上传临时/永久素材
type素材类型
临时素材：type:[image,voice,video,thumb],material:资源路径
永久素材上传：type:[news,image,voice,video,thumbP],material
永久图文素材中的图片上传：type='pic'
*/
exports.uploadMaterial = (type, material, isPermanent) => {
    let getUrl = null;
    let paramArr = [];
    let formData = {
        type: type
    };
    let reqOpts = {
        method: 'POST'
    };
    if (type === 'pic') {
        formData.media = fs.createReadStream(material);
        getUrl = opts.permanentPicUploadUrl;
    } else if (type === 'news') {
        reqOpts.body = formData;
        getUrl = opts.permanentUploadUrl;
        paramArr = [true];
    } else {
        formData.type = type;
        formData.media = fs.createReadStream(material);
        if (type === 'video' && isPermanent) {
            formData.description = JSON.stringify(isPermanent);
        }
        if (isPermanent) {
            getUrl = opts.permanentUploadUrl;
        } else {
            getUrl = opts.temporaryUploadUrl;
            paramArr = [type];
        }
    }
    reqOpts.formData = formData;
    return requestByToken(reqOpts, getUrl, paramArr);
};
/*
删除永久素材
*/
exports.deleteMaterial = mediaId => {
    return requestByToken({
        method: 'POST',
        body: {
            media_id: mediaId
        }
    }, opts.deleteMaterialUrl);
};
/*
更新永久图文素材
*/
exports.updateMaterial = news => {
    return requestByToken({
        method: 'POST',
        body: news
    }, opts.updateNewsUrl);
};
/*
获取永久素材列表
*/
exports.getMaterialList = (params) => {
    return requestByToken({
        method: 'POST',
        body: params
    }, opts.materialListUrl);
};
/*
获取永久素材数量
*/
exports.getMaterialCount = () => {
    return requestByToken({
        method: 'GET'
    }, opts.materialCountUrl);
};
