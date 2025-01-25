const User=require('../../models/User');
const bcrypt=require('bcryptjs');

const handlePostSignupInfo=async(ctx)=>{
    if(ctx.method!=='POST')
    {
        ctx.status=405;
        ctx.body={
            message: 'method not allowed'
        };
        return;
    }

    const username=ctx.request.body.username;
    const password=ctx.request.body.password;
    //const [username,password]=ctx.request.body;

    const existingUser= await User.findOne({username})

    if(existingUser)
    {
        ctx.status=400;
        ctx.body={
            message: 'username existed',
            code: 2,
        };
        return;
    }

    const regex=/^[!-~]+$/
    if(username.length<1||username.length>20||password.length<4||password.length>32||!regex.test(password))
    {
        ctx.status=400;
        ctx.body={
            message: 'invalid username or password',
            code: 3,
        };
        return;
    }

    const newUser=new User({
        username,
        password,
    });

    await newUser.save();

    ctx.status=201;
    ctx.body={
        message: 'new user registered successfully',
        code: 1,
    };
}

module.exports={
    handlePostSignupInfo,
}
