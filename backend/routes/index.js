const Router=require('koa-router');
const { captchaRouter }=require('../utils/captcha');
const getUserInfoRouter = require('../utils/getUserInfo');
const homeRouter=require('../apps/home/router');
const signupRouter=require('../apps/signup/router');
const loginRouter=require('../apps/login/router');
const uploadRouter=require('../apps/upload/router');

const router=new Router();

router.use('/api/captcha', captchaRouter.routes());
router.use('/api/getUserInfo', getUserInfoRouter.routes());
router.use('/home/api', homeRouter.routes());
router.use('/signup/api', signupRouter.routes());
router.use('/login/api', loginRouter.routes());
router.use('/upload/api', uploadRouter.routes());

module.exports=router;