const getHomeMessage = async(ctx)=>{
    ctx.body={
        message: 'hello world',
    };
}

module.exports={getHomeMessage};