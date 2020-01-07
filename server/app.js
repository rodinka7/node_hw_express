const Koa = require('koa');
const serve = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const pug = new Pug({
    viewPath: './views',
    pretty: false,
    noCache: true,
    app: app
});

const { promisify } = require('util');
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);

require('./db');
require('./controllers');
const router = require('./routes');
const config = require('./config');
const errorHandler = require('./libs/error');

const port = process.env.PORT || 8000;

app.use(serve(path.join(__dirname, '../client/public')));
app.use(errorHandler);

app.on('error', async (err, ctx) =>
    await ctx.render('error', {
        status: ctx.response.status,
        error: ctx.response.message
    })
);

app
    .use(session(config.session, app))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, async () => {
    try{
        await access(config.upload);
    } catch(err){
        await mkdir(config.upload);
    }

    console.log(`Server is running on ${port} port`);
})

