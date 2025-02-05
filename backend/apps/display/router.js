const Router=require('koa-router');
const handleGetDisplay=require('./controller');

const router=new Router();

router.get('/getDisplay/:type/:objectId', handleGetDisplay);

module.exports=router;