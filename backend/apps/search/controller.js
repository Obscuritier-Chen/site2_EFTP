const queryDatabase=require('./queryDB');

const handleGetSearchInfo=async(ctx)=>{
    const {q, type, size, time, page=1}=ctx.query;


}

module.exports=handleGetSearchInfo;