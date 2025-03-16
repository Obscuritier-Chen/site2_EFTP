const UploadFiles=require('../../models/UploadFiles');
const UploadText=require('../../models/UploadText');

const queryDatabase=async(q, type, size, time, page)=>{
    const sizeToMaxsize={
        all: null,
        '0~10MB': 10*1024*1024,
        '10~100MB': 100*1024*1024,
        '100~1000MB': 1000*1024*1024,
        '>1000MB': null,
    }
    const sizeToMinsize={
        all: null,
        '0~10MB': 0,
        '10~100MB': 10*1024*1024,
        '100~1000MB': 100*1024*1024,
        '>1000MB': 1000*1024*1024,
    }
    const now=new Date();
    const timeTodate={
        all: new Date(0),
        'in_one_week': new Date(now),
        'in_one_month': new Date(now),
        'in_one_year': new Date(now),
    }

    timeTodate['in_one_week'].setDate(now.getDate()-7);
    timeTodate['in_one_month'].setMonth(now.getMonth()-1);
    timeTodate['in_one_year'].setFullYear(now.getFullYear()-1);

    const perPage=40;
    const skip=(page-1)*40;
    
    let [{queryResult, totalDataNum}]= await UploadText.aggregate([
        { 
            $addFields: { source: "UploadText" } 
        },
        { 
            $unionWith: { 
                coll: 'uploadfiles', 
                pipeline: [
                    { $addFields: { source: "UploadFiles" } }
                ] 
            },
        },
        {
            $match: {
                $and: [
                    { title: { $regex: q, $options: 'i' } },
                    {
                        $expr: {
                            $cond: {
                                if: { $eq: ['$source', 'UploadFiles'] },
                                then: {
                                    $and: [
                                        { 
                                            $or: [
                                                { $eq: [sizeToMaxsize[size], null] }, 
                                                { $lte: ['$size', sizeToMaxsize[size]] }
                                            ] 
                                        },
                                        { 
                                            $or: [
                                                { $eq: [sizeToMinsize[size], null] }, 
                                                { $gte: ['$size', sizeToMinsize[size]] }
                                            ] 
                                        }
                                    ]
                                },
                                else: true
                            }
                        }
                    },
                    {
                        $expr: {
                            $cond: {
                                if: { $eq: ['$source', 'UploadText'] },
                                then: { $gte: ['$uploadedAt', timeTodate[time]] },
                                else: { $gte: ['$createdAt', timeTodate[time]] }
                            }
                        }
                    },
                    ...(type === 'all' ? [] : [{ source: type === 'text' ? 'UploadText' : 'UploadFiles' }])
                ]
            }
        },
        {
            $facet: {
                queryResult: [
                    {
                        $addFields: {
                            timestamp: { $ifNull: ['$uploadedAt', '$createdAt'] }
                        }
                    },
                    {
                        $sort: { timestamp: -1 }
                    },
                    {
                        $skip: skip,
                    },
                    {
                        $limit: perPage,
                    }
                ],
                totalDataNum: [{$count: 'totalDataNum'}],
            }
        },
    ]).exec();

    totalDataNum.length ? totalDataNum=totalDataNum[0].totalDataNum : totalDataNum=0;

    return [queryResult, totalDataNum];
}

module.exports=queryDatabase;