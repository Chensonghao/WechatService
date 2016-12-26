'use strict';
const koa = require('koa');
const router = require('koa-router')();
const views = require('co-views');
const wechat = require('./wechat/');
const ticket = require('./wechat/components/ticket');
const config = require('./config');
const log = require('cshlog');

// const menuManager = require('./wechat/components/menuManager');
// const argv = process.argv;
// if (argv && argv.length > 2 && argv[2] === '-menu') {
//     menuManager.deleteMenu().then(() => {
//         menuManager.createMenu().then(m => {
//             log.info('成功创建自定义菜单。');
//             console.log('Menu is created!!!');
//         });
//     });
// }

var app = new koa();
//路由设置
app.use(router.routes()).use(router.allowedMethods());
//模版引擎设置
const render = views(__dirname + '/www/view', {
    map: {
        html: 'ejs'
    }
});

router.get('/record', async(ctx, next) => {
    await ticket(ctx, next);
    const html = await render('record', ctx.sign);
    ctx.body = html;
});
router.get('/',wechat(config.wechat));
// app.use(async(ctx, next) => {
//     if(ctx.path === '/record'){
//         await ticket(ctx, next);
//         const html = await render('record', ctx.sign);
//         ctx.body = html;
//         return next;
//     }
//     await next();
// });
//app.use(wechat(config.wechat));

app.listen(config.port);
console.log(`^_^ Server is listening on port : ${config.port} ^_^`);
log.info(`Server is listening on port : ${config.port}`);
