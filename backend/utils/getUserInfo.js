const Router=require('koa-router');
const koaBody=require('koa-body').default;
const loginCheck=require('./loginCheck');

const getUserInfoRouter=new Router();

getUserInfoRouter.post('/', koaBody({multipart: true}),async(ctx)=>{
    [isLogin, code, message, user]=await loginCheck(ctx);

    if(!isLogin)
    {
        ctx.status=200;//本来用的401 但感觉用户没登录不是问题
        ctx.body={
            code,
            message,
        }
        return;
    }

    ctx.status=200;
    ctx.body={
        code,
        message,
        user:{
            username: user.username,
        }
    };
});

module.exports=getUserInfoRouter;