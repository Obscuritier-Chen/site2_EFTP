const svg_captcha=require('svg-captcha');
const Router=require('koa-router');

const captchaRouter=new Router();

captchaRouter.get('/get', async (ctx)=>{
    const captcha=svg_captcha.create({
        height: 40,
        width: 88
    });
    ctx.session.captcha=captcha.text;
    ctx.body=captcha.data;
});

function checkCaptcha(ctx, inputCaptcha)
{
    const storedCaptcha=ctx.session.captcha;
    if(!storedCaptcha || inputCaptcha.toLowerCase()!==ctx.session.captcha.toLowerCase())
        return false;
    
    ctx.session.captcha=null;//清除储存的验证码
    return true;
}

module.exports={
    captchaRouter,
    checkCaptcha,
};