const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const config = require('../config');

const CTRL = global.CTRL;

router.get('/', async (ctx, next) => {
    await CTRL.emit('index/get')
    .then(async data => await ctx.render('index', data))
    .catch(error => ctx.render('error', { message: error.message }));
});

router.get('/login', async (ctx, next) => {
    await CTRL.emit('login/get', ctx.session)
    .then(async data => {
        if (data.isAuthorized)
            ctx.redirect('/admin');
        else
            await ctx.render('login');
    })
    .catch(async error => await ctx.render('error', { message: error.message }));
});

router.get('/admin', async (ctx, next) => {
    await CTRL.emit('admin/get', ctx.session)
    .then(async data => {
        if (!data.isAuthorized)
            ctx.redirect('/login');
        else
            await ctx.render('admin', data);
    })
    .catch(async error => await ctx.render('error', error))
});

router.post('/', koaBody(), async (ctx, next) => {
    await CTRL.emit('index/post', ctx.request.body)
    .then(() => ctx.redirect('/'))
    .catch(async error => await ctx.status(error.status || 400).render('error', error))
});

router.post('/login', koaBody(), async (ctx, next) => {
    await CTRL.emit('login/post', ctx.request.body)
    .then(data => {
        if (data.isAuthorized){
            ctx.session.isAuthorized = true;
            ctx.redirect('/admin');
        }
    })
    .catch(async error => await ctx.status(error.status || 400).render('error', error))
});

router.post('/admin/skills', koaBody(), async (ctx, next) => {
    await CTRL.emit('admin/skills', ctx.request.body)
    .then(() => ctx.redirect('/admin'))
    .catch(async error => await ctx.status(error.status || 400).render('error', error))
});

router.post('/admin/upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir: config.upload
    }
}), async (ctx, next) => {
    await CTRL.emit('admin/upload', ctx.request)
    .then(() => ctx.redirect('/admin'))
    .catch(async error => await ctx.status(error.status || 400).render('error', error))
});

module.exports = router;