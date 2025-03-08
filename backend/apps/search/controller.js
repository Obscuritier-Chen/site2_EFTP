const queryDatabase=require('./queryDB');

const handleGetSearchInfo=async(ctx)=>{
    const {q, type='all', size='all', time='all', page=1}=ctx.query;

    queryResult=await queryDatabase(q, type, size, time, page);

    ctx.status=200;
    ctx.body={
        message: 'query successfully',
        queryResult,
    }
}

module.exports=handleGetSearchInfo;