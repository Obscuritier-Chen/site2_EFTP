const Router=require('koa-router');

const handleGetSearchInfo=require('./controller');

const router=new Router();

router.get('/', handleGetSearchInfo);

module.exports=router;