const mongoose=require('mongoose');
const UploadFiles=require('../../models/UploadFiles');
const UploadText=require('../../models/UploadText');
const User=require('../../models/User');
const File=require('../../models/File')

const handleGetDisplay=async(ctx)=>{
    const type=ctx.params.type;
    const objectId=ctx.params.objectId;

    const resourceObjectId=new mongoose.Types.ObjectId(objectId);
    
    if(type!=='text'&&type!=='files')
    {
        ctx.status=400;
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
                message: 'resouce is not found'
            }
            return
        }

        const textAuthor=await User.findById(UploadTextInfo.userObjectId);

        responseBody.title=UploadTextInfo.title;
        responseBody.text=UploadTextInfo.text;
        responseBody.uploadedAt=UploadTextInfo.uploadedAt;
        responseBody.author=textAuthor.username;
    }

    else if(type==='files')
    {
        const UploadFilesInfo=await UploadFiles.findById(resourceObjectId);

        if(!UploadFilesInfo)
        {
            ctx.status=404;
            ctx.body={
                code: 3,
                message: 'resouce is not found'
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

        responseBody.title=UploadFilesInfo.title;
        responseBody.text=UploadFilesInfo.text;
        responseBody.uploadedAt=UploadFilesInfo.uploadedAt;
        responseBody.author=textAuthor.username;
        responseBody.files=files;
    }

    responseBody.code=1;
    responseBody.message='resource info get successfully';

    ctx.status=200;
    ctx.body=responseBody;
};

module.exports=handleGetDisplay;