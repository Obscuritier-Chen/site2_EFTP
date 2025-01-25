const Router=require('koa-router');
const koaBody=require('koa-body').default;
const { handlePostLoginInfo }=require('./controller')

const router=new Router();

router.post('/postLoginInfo', koaBody({multipart: true}),handlePostLoginInfo);

module.exports=router;