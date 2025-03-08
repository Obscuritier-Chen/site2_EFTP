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

    const queryResult = await UploadText.aggregate([
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
                                            $cond: {
                                                if: { $eq: [sizeToMaxsize[size], null] }, // 如果 sizeToMaxsize[size] 为 null
                                                then: true,        // 则条件始终为 true (取消上限限制)
                                                else: { $lte: ['$size', sizeToMaxsize[size]] } // 否则应用 <= 上限 限制
                                            }
                                        },
                                        {
                                            $cond: {
                                                if: { $eq: [sizeToMinsize[size], null] }, // 如果 sizeToMinsize[size] 为 null
                                                then: true,        // 则条件始终为 true (取消下限限制)
                                                else: { $gte: ['$size', sizeToMinsize[size]] } // 否则应用 >= 下限 限制
                                            }
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
                    }
                ]
            }
        },
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
    ]).exec();

    return queryResult.map(doc=>{
        return {
            timestamp: doc.timestamp,
            source: doc.source,
        }
    });
}

module.exports=queryDatabase;