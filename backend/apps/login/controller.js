const jwt=require('jsonwebtoken');
const User=require('../../models/User');
const { checkCaptcha }=require('../../utils/captcha');

const handlePostLoginInfo=async(ctx)=>{
    console.log(['test','test'])

    const username=ctx.request.body.username;
    const password=ctx.request.body.password;
    const captcha=ctx.request.body.captcha;

    const user=await User.findOne({username});//查找用户

    if(!checkCaptcha(ctx, captcha))
    {
        ctx.status=400,
        ctx.body={
            code: 2,
            message: 'wrong captcha',
        }
        return;
    }

    if(!user)
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'user does not exist',
        }
        return;
    }

    const passwordMatch=await user.comparePassword(password);

    if(!passwordMatch)
    {
        ctx.status=400;
        ctx.body={
            code: 4,
            message: 'wrong password',
        }
        return;
    }

    //登录成功
    const token=jwt.sign({id: user._id}, 'mysecretkeyoflogin', {expiresIn: '5d'});
    ctx.body={
        code: 1,
        message: 'login successfully',
        token,
    }
}

module.exports={
    handlePostLoginInfo,
}