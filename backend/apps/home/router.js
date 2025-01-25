const Router=require('koa-router');
const { getHomeMessage }=require('./controller');

const router=new Router();

router.get('/', getHomeMessage);

module.exports=router;