'use strict';
module.exports = params => {
    switch (params.msgType) {
        case 'text':
            return textMsg(params);
        case 'image':
            return imageMsg(params);
        case 'voice':
            return voiceMsg(params);
        case 'video':
            return videoMsg(params);
        case 'music':
            return musicMsg(params);
        case 'news':
            return newsMsg(params);
    }
};
/*
文本消息模版
*/
function textMsg(params) {
    return `<xml>
<ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
<FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
<CreateTime>${params.createTime}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${params.content}]]></Content>
</xml>`
}
/*
图片消息模版
*/
function imageMsg(params){
    return `<xml>
<ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
<FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
<CreateTime>${params.createTime}</CreateTime>
<MsgType><![CDATA[image]]></MsgType>
<Image>
<MediaId><![CDATA[${params.mediaId}]]></MediaId>
</Image>
</xml>`;
};
/*
语音消息模版
*/
function voiceMsg(params) {
    return `<xml>
<ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
<FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
<CreateTime>${params.createTime}</CreateTime>
<MsgType><![CDATA[voice]]></MsgType>
<Voice>
<MediaId><![CDATA[${params.mediaId}]]></MediaId>
</Voice>
</xml>`;
};
/*
视频消息模版
*/
function videoMsg(params) {
    return `<xml>
<ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
<FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
<CreateTime>${params.createTime}</CreateTime>
<MsgType><![CDATA[video]]></MsgType>
<Video>
<MediaId><![CDATA[${params.mediaId}]]></MediaId>
<Title><![CDATA[${params.title||''}]]></Title>
<Description><![CDATA[${params.desc||''}]]></Description>
</Video>
</xml>`;
};
/*
音乐消息模版
*/
function musicMsg(params) {
    return `<xml>
<ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
<FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
<CreateTime>${params.createTime}</CreateTime>
<MsgType><![CDATA[music]]></MsgType>
<Music>
<Title><![CDATA[${params.title||''}]]></Title>
<Description><![CDATA[${params.desc||''}]]></Description>
<MusicUrl><![CDATA[${params.musicUrl||''}]]></MusicUrl>
<HQMusicUrl><![CDATA[${params.hqMusicUrl||''}]]></HQMusicUrl>
<ThumbMediaId><![CDATA[${params.thumbMediaId||''}]]></ThumbMediaId>
</Music>
</xml>`;
};
/*
图文消息模版
articles限制10条以内，多余无法显示
*/
function newsMsg(params) {
    let articleArr = [];
    params.articles.forEach(art => {
        articleArr.push(`<item>
        <Title><![CDATA[${art.title||''}]]></Title>
        <Description><![CDATA[${art.desc||''}]]></Description>
        <PicUrl><![CDATA[${art.picUrl||''}]]></PicUrl>
        <Url><![CDATA[${art.url||''}]]></Url>
        </item>`);
    });
    let items = articleArr.join('');
    return `<xml>
        <ToUserName><![CDATA[${params.toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${params.fromUserName}]]></FromUserName>
        <CreateTime>${params.createTime}</CreateTime>
        <MsgType><![CDATA[news]]></MsgType>
        <ArticleCount>${params.articles.length}</ArticleCount>
        <Articles>${items}</Articles></xml> `;
};
