/*
文本消息模版
*/
exports.textMsg = (toUser, fromUser, time, content) => {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${time}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${content}]]></Content>
</xml>`
};
/*
图片消息模版
*/
exports.imageMsg = (toUser, fromUser, time, imageId) => {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${time}</CreateTime>
<MsgType><![CDATA[image]]></MsgType>
<Image>
<MediaId><![CDATA[${imageId}]]></MediaId>
</Image>
</xml>`;
};
/*
语音消息模版
*/
exports.imageMsg = (toUser, fromUser, time, mediaId) => {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${time}</CreateTime>
<MsgType><![CDATA[voice]]></MsgType>
<Voice>
<MediaId><![CDATA[${mediaId}]]></MediaId>
</Voice>
</xml>`;
};
/*
视频消息模版
*/
exports.imageMsg = (toUser, fromUser, time, mediaId, title, desc) => {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${time}</CreateTime>
<MsgType><![CDATA[video]]></MsgType>
<Video>
<MediaId><![CDATA[${mediaId}]]></MediaId>
<Title><![CDATA[${title}]]></Title>
<Description><![CDATA[${desc}]]></Description>
</Video>
</xml>`;
};
/*
音乐消息模版
*/
exports.imageMsg = (toUser, fromUser, time, title, desc, musicUrl, HQMusicUrl, thumbMediaId) => {
    return `<xml>
<ToUserName><![CDATA[${toUser}]]></ToUserName>
<FromUserName><![CDATA[${fromUser}]]></FromUserName>
<CreateTime>${time}</CreateTime>
<MsgType><![CDATA[music]]></MsgType>
<Music>
<Title><![CDATA[${title}]]></Title>
<Description><![CDATA[${desc}]]></Description>
<MusicUrl><![CDATA[${musicUrl}]]></MusicUrl>
<HQMusicUrl><![CDATA[${HQMusicUrl}]]></HQMusicUrl>
<ThumbMediaId><![CDATA[${thumbMediaId}]]></ThumbMediaId>
</Music>
</xml>`;
};
/*
图文消息模版
articles限制10条以内，多余无法显示
*/
exports.imageMsg = (toUser, fromUser, time, articles) => {
    let articleArr = [];
    articles.forEach(art => {
        articleArr.push(`<item>
        <Title><![CDATA[${art.title}]]></Title>
        <Description><![CDATA[${art.desc}]]></Description>
        <PicUrl><![CDATA[${art.picUrl}]]></PicUrl>
        <Url><![CDATA[${art.url}]]></Url>
        </item>`);
    });
    let items = articleArr.join('');
    return `<xml>
        <ToUserName><![CDATA[${toUser}]]></ToUserName>
        <FromUserName><![CDATA[${fromUser}]]></FromUserName>
        <CreateTime>${time}</CreateTime>
        <MsgType><![CDATA[news]]></MsgType>
        <ArticleCount>${articles.length}</ArticleCount>
        <Articles>${items}</Articles></xml> `;
};
