const Koa=require('koa');
const serve=require('koa-static');
const koaBody = require('koa-body').default;
const path=require('path');
const morgan=require('koa-morgan');
const mongoose = require('mongoose');
const router=require('./routes');
const koaSession=require('koa-session');
const jwt=require('koa-jwt');
const uuid=require('uuid');

const app=new Koa();

// 连接到 MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

app.use(morgan('combined'));//日志中间件

// 密钥，用于加密 session cookie
app.keys = ['yoursecretkey'];

// 配置 session 中间件
const CONFIG = {
    key: 'koa:sess', // cookie 键名
    maxAge: 86400000, // cookie 过期时间 (毫秒)，这里是一天
    httpOnly: true,   // 只通过 HTTP 传输，不允许 JavaScript 访问
    signed: true,     // 是否签名 cookie，防篡改
};

// 使用 session 中间件
app.use(koaSession(CONFIG, app));

// 使用 koaBody 中间件，配置文件上传路径 
/*app.use(koaBody({
    multipart: true, // 支持文件上传 现在扔到router 以便于个性化处理
    formidable: {
        uploadDir: path.join(__dirname, './uploads'), // 上传文件的存放路径
        keepExtensions: true, // 保留文件的扩展名
        filename: (name, ext, part, form)=>{
            const uniqueName=uuid.v4();
            return `${uniqueName}${ext}`;
        },
    }
}));*/

// Serve static files from the frontend build directory
app.use(serve(path.join(__dirname, '../frontend/build')));

// 未授权响应
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = { code: 4, message: '未授权' };
        } else {
            throw err;
        }
    });
});

app.use(router.routes()).use(router.allowedMethods());

// All other requests should return the frontend index.html
app.use(async (ctx) => {
    ctx.type = 'html';
    ctx.body = require('fs').createReadStream(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(3000, ()=>{
    //console.log('hello world')
});