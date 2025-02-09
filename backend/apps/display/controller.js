const mongoose=require('mongoose');
const UploadFiles=require('../../models/UploadFiles');
const UploadText=require('../../models/UploadText');
const User=require('../../models/User');
const File=require('../../models/File');
const TextEvalue=require('../../models/TextEvalue');
const FilesEvalue=require('../../models/FilesEvalue');

const loginCheck=require('../../utils/loginCheck');

async function checkUser(ctx)
{
    [isLogin, _, _, user]=await loginCheck(ctx);

    if(!isLogin)
        return [false, _];

    return [true, user];
}

const handleGetDisplay=async(ctx)=>{
    const type=ctx.params.type;
    const objectId=ctx.params.objectId;

    const resourceObjectId=new mongoose.Types.ObjectId(objectId);

    console.log(type, objectId)

    if(!type||!objectId)
    {
        ctx.status=404;
        ctx.body={
            code: 3,
            message: 'resource is not found'
        }
    }
    
    if(type!=='text'&&type!=='files')
    {
        ctx.status=404;
        ctx.body={
            code: 2,
            message: 'invalid type',
        }
        return;
    }

    const responseBody={};

    if(type==='text')//我不想将主要代码用if套起来 但是展平写过于麻烦
    {
        const UploadTextInfo=await UploadText.findById(resourceObjectId);

        if(!UploadTextInfo)
        {
            ctx.status=404;
            ctx.body={
                code: 3,
                message: 'resource is not found'
            }
            return
        }

        UploadTextInfo.viewNum++;

        const textAuthor=await User.findById(UploadTextInfo.userObjectId);

        await UploadTextInfo.save();

        responseBody.type='text';
        responseBody.title=UploadTextInfo.title;
        responseBody.text=UploadTextInfo.text;
        responseBody.uploadedAt=UploadTextInfo.uploadedAt;
        responseBody.author=textAuthor.username;
        responseBody.viewNum=UploadTextInfo.viewNum;
        responseBody.likeNum=UploadTextInfo.likeNum;
        responseBody.dislikeNum=UploadTextInfo.dislikeNum;
        responseBody.downloadNum=UploadTextInfo.downloadNum;
    }

    else if(type==='files')
    {
        const UploadFilesInfo=await UploadFiles.findById(resourceObjectId);

        if(!UploadFilesInfo)
        {
            ctx.status=404;
            ctx.body={
                code: 3,
                message: 'resource is not found'
            }
            return;
        }

        let files=[];

        for(let i=0;i<UploadFilesInfo.files.length;i++)
        {
            const file=await File.findById(UploadFilesInfo.files[i]);

            files.push({
                filename: file.originalFilename,
                size: file.size,
                fileObjectId: file._id,
                createAt: file.createAt,
            });
        }

        const textAuthor=await User.findById(UploadFilesInfo.userObjectId);

        responseBody.type='files';
        responseBody.title=UploadFilesInfo.title;
        responseBody.text=UploadFilesInfo.text;
        responseBody.createdAt=UploadFilesInfo.createdAt;
        responseBody.author=textAuthor.username;
        responseBody.files=files;
        responseBody.viewNum=UploadFilesInfo.viewNum;
        responseBody.likeNum=UploadFilesInfo.likeNum;
        responseBody.dislikeNum=UploadFilesInfo.dislikeNum;
        responseBody.downloadNum=UploadFilesInfo.downloadNum;
    }

    responseBody.code=1;
    responseBody.message='resource info get successfully';

    ctx.status=200;
    ctx.body=responseBody;
};

async function handleEvalueCreate(type, resourceObjectId, userObjectId, existedEvalueData, evaluation, TargetUploadedResource)
{
    if(existedEvalueData)
        return [8, 'already evalued'];

    const newEvalueData= type==='text' ? new TextEvalue({
        evaluation,
        textObjectId: resourceObjectId,
        userObjectId,
    }) : new FilesEvalue({
        evaluation,
        filesObjectId: resourceObjectId,
        userObjectId,
    });

    await newEvalueData.save();

    evaluation==='like' ? TargetUploadedResource.likeNum++ : TargetUploadedResource.dislikeNum++;
    TargetUploadedResource.save();

    return [1, 'evaluation is uploaded successfully'];
}

async function handleEvalueDelete(_, _, _,existedEvalueData, _, TargetUploadedResource)
{
    if(!existedEvalueData)
        return [9, 'is not evalued'];

    const evaluation=existedEvalueData.evaluation;

    await existedEvalueData.deleteOne();

    evaluation==='like' ? TargetUploadedResource.likeNum-- : TargetUploadedResource.dislikeNum--;
    TargetUploadedResource.save();

    return [1, 'evaluation is deleted successfully'];
}

async function handleEvalueUpdate(_, _, _,existedEvalueData, _, TargetUploadedResource)
{
    if(!existedEvalueData)
        return [9, 'is not evalued'];

    existedEvalueData.evaluation= existedEvalueData.evaluation==='like' ? 'dislike' : 'like';

    await existedEvalueData.save();

    const evaluation=existedEvalueData.evaluation;

    if(evaluation==='dislike')
    {
        TargetUploadedResource.likeNum--;
        TargetUploadedResource.dislikeNum++;
    }
    else if(evaluation==='like')
    {
        TargetUploadedResource.likeNum++;
        TargetUploadedResource.dislikeNum--;
    }
        
    TargetUploadedResource.save();

    return [1, 'evaluation is updated successfully'];
}

async function handleEvalueFetch(_, _, _,existedEvalueData, _)
{
    const evaluation=!existedEvalueData.evaluation ? null : existedEvalueData.evaluation;

    return [evaluation, 1, 'evaluation is fetched successfully']
}

const actions=new Map([
    ['create', handleEvalueCreate],
    ['delete', handleEvalueDelete],
    ['update', handleEvalueUpdate],
    ['fetch', handleEvalueFetch],
]);

const handleUploadEvalue=async(ctx)=>{
    [ok, user]=await checkUser(ctx);

    if(!ok)
    {
        ctx.status=401;
        ctx.body={
            code: 2,
            message: 'is not login',
        }
        return;
    }

    const type=ctx.params.type;
    const orginalResourceObjectId=ctx.params.objectId;
    const action=ctx.params.action;
    const evaluation=ctx.params.evaluation;
    const originalUserObjectId=user._id;

    if(type!=='text'&&type!=='files')
    {
        ctx.status=400;
        ctx.body={
            code: 4,
            message: 'invalid resource type',
        }
    }

    if(!orginalResourceObjectId||!action)
    {
        ctx.status=400;
        ctx.body={
            code: 5,
            message: 'lack info',
        }
    }

    const actionFunc=actions.get(action);

    if(!actionFunc)
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'invalid action',
        }
        return;
    }

    let resourceObjectId=null;
    let userObjectId=null;

    try
    {
        resourceObjectId=new mongoose.Types.ObjectId(orginalResourceObjectId);
        userObjectId=new mongoose.Types.ObjectId(originalUserObjectId);
    }
    catch
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'invalid info',
        }
        return;
    }

    const TargetUploadedResource=await (type==='text' ? UploadText.findById(resourceObjectId) : UploadFiles.findById(resourceObjectId));

    if(!TargetUploadedResource)
    {
        ctx.status=400;
        ctx.body={
            code: 6,
            message: 'resource is not found'
        }
        return;
    }

    const existedEvalueData=await (type==='text' ? TextEvalue.findOne({
        textObjectId: resourceObjectId,
        userObjectId,
    }) : FilesEvalue.findOne({
        filesObjectId: resourceObjectId,
        userObjectId,
    }));

    if(action!=='fetch')
    {
        [code, message]=await actionFunc(type, orginalResourceObjectId, originalUserObjectId, existedEvalueData, evaluation, TargetUploadedResource);

        ctx.status= code===1 ? 200 : 400;
        ctx.body={
            code,
            message,
        }
        return;
    }

    else if(action==='fetch')
    {
        [userEvaluation, code, message]=await actionFunc(_,_,_,existedEvalueData,_);

        ctx.status= code===1 ? 200 : 400;
        ctx.body={
            evaluation: userEvaluation,
            code,
            message,
        }
        return;
    }
}

module.exports={handleGetDisplay, handleUploadEvalue};