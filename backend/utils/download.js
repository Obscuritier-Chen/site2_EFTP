const Router=require('koa-router');
const fs=require('fs');
const mongoose=require('mongoose');

const File=require('../models/File');

const downloadRouter=new Router();

downloadRouter.get('/:fileObjectId', async(ctx)=>{
    let fileObjectId=ctx.params.fileObjectId;

    try{
        fileObjectId=new mongoose.Types.ObjectId(fileObjectId);
    } catch{
        ctx.status=400;
        ctx.body={
            code: 2,
            message: 'invalid file id',
        }
        return;
    };

    const TargetFile=await File.findById(fileObjectId);

    if(!TargetFile)
    {
        ctx.status=404;

        ctx.body={
            code: 3,
            message: 'file not found',
        }
        return;
    }

    const file=TargetFile.filePath;
    const filename=TargetFile.originalFilename;

    ctx.status=200;
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`); // 设置响应头
    ctx.body=fs.createReadStream(file);
});

module.exports=downloadRouter;