const queryDatabase=require('./queryDB');

const handleGetSearchInfo=async(ctx)=>{
    const {q='', type='all', size='all', time='all', page=1}=ctx.query;

    [queryResult, totalDataNum]=await queryDatabase(q, type, size, time, page);

    queryResult=queryResult.map((doc)=>{
        return {
            title: doc.title,
            time: doc.timestamp,
            type: doc.source,
            id: doc._id,
        }
    })

    ctx.status=200;
    ctx.body={
        message: 'query successfully',
        queryResult,
        totalDataNum,
    }
}

module.exports=handleGetSearchInfo;