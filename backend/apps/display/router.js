const Router=require('koa-router');
const {handleGetDisplay, handleUploadEvalue}=require('./controller');

const router=new Router();

router.get('/getDisplay/:type/:objectId', handleGetDisplay);
router.get('/evalue/:type/:objectId/:action/:evaluation?', handleUploadEvalue);

module.exports=router;