const Router=require('koa-router');
const jwt=require('jsonwebtoken');
const secretKey='mysecretkeyoflogin';
const User=require('../models/User');

async function loginCheck(ctx)//return[islogin, code, message, user]
{
    const authHeader=ctx.headers['authorization'];

    if(!authHeader)
        return [false, 2, 'token is missing', null];

    const token = authHeader.split(' ')[1];

    try
    {
        const decoded=jwt.verify(token,secretKey);
        ctx.state.user=decoded;
    }
    catch(err)
    {
        return [false, 3, 'invalid token', null];
    }

    const user=await User.findById(ctx.state.user.id).select('-password');

    if(!user)
        return [false, 4, 'user is not exist', null];

    return [true, 1, 'login check passed', user];
}

module.exports=loginCheck;