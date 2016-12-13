'use strict';
const xml2js = require('xml2js');
const Promise = require('bluebird');

exports.parseXMLAsync = xml => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {
            trim: true
        }, (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
};

function formatMessage(result){
    let message = {};
    if(typeof result === 'object'){
        let keys = Object.keys(result);
        keys.forEach(key => {
            let item = result[key];
            if(Object.prototype.toString.call(item) === '[object Array]' && item.length > 0){
                if(item.length === 1){
                    let value = item[0];
                    if(typeof value === 'object'){
                        message[key] = formatMessage(value);
                    }else{
                        message[key] = (value || '').trim();
                    }
                }else{
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
