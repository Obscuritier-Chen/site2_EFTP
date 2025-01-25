const Router=require('koa-router');
const koaBody=require('koa-body').default;
const { handlePostSignupInfo }=require('./controller');

const router=new Router();

router.post('/postSignupInfo', koaBody({multipart: true}), handlePostSignupInfo);

module.exports=router;