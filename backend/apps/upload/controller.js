const mongoose=require('mongoose')
const path=require('path')
const uuid=require('uuid')
const fs=require('fs')

const UploadText=require('../../models/UploadText');
const File=require('../../models/File');
const UploadFiles=require('../../models/UploadFiles');
const loginCheck=require('../../utils/loginCheck');
const { uploadToken }=require('./file_upload_cheker_middleware');
const { console } = require('inspector');
const { log } = require('console');

async function checkUser(ctx)
{
    [isLogin, _, _, user]=await loginCheck(ctx);

    if(!isLogin)
        return [false, _];

    return [true, user];
}

const handlePostUploadText=async(ctx)=>{
    const maxTextNum=6000;

    [ok, user]=await checkUser(ctx);

    const title=ctx.request.body.title;
    const text=ctx.request.body.text;

    if(!ok)
    {
        ctx.status=401;
        ctx.body={
            code: 2,
            message: 'is not login',
        };
        return;
    }

    if(text.length===0||title.length===0)
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'content is empty',
        };
        return;
    }

    if(text.length>maxTextNum)
    {
        ctx.status=400;
        ctx.body={
            code: 4,
            message: 'text is too long',
        };
        return;
    }

    const regex = /^(?!.*[<>])(?!.*\s)(?!.*\n).*$/;
    if(!regex.test(text))
    {
        ctx.status=400;
        ctx.body={
            code: 5,
            message: 'format error',
        };
        return;
    }

    const newUploadText=new UploadText({
        title,
        text,
        userObjectId: user._id,
    });

    await newUploadText.save();

    ctx.status=201;
    ctx.body={
        code: 1,
        message: 'upload text successfully',
    };
};
const handlePostRequireUploadToken=async(ctx)=>{
    const uploadTokenTimeout=1000*60*20;
    const maxFilsSize=524288000;

    [ok, user]=await checkUser(ctx);

    if(!ok)
    {
        ctx.status=401;
        ctx.body={
            code: 2,
            message: 'is not login',
        };
        return;
    }

    const filesNum=ctx.request.body.filesNum;
    const filesSize=ctx.request.body.filesSize;
    const title=ctx.request.body.title;

    process.stdout.write("Hello from stdout\n");

    if(!filesNum||!filesSize)
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'lack info',
        };
        return;
    }

    if(filesSize>maxFilsSize)
    {
        ctx.status=400;
        ctx.body={
            code: 4,
            message: 'files size is too large',
        };
        return;
    }

    if(!title)
    {
        ctx.status=400;
        ctx.body={
            code: 5,
            message: 'title is empty',
        };
        return;
    }

    const newUploadedFiles=new UploadFiles({
        title,
        files: [],
        userObjectId: user._id,
    });

    await newUploadedFiles.save();

    const newUploadedFilesId=newUploadedFiles._id;

    const token=uuid.v4();
    const tokenContent={
        userObjectId: user._id,
        filesNum,
        filesSize,
        currentFilesSize: 0,
        currentFilesNum: 0,
        UploadFilesId: newUploadedFilesId,
    }

    uploadToken.set(token, tokenContent);

    setTimeout(()=>{
        uploadToken.delete(uuid);
    }, uploadTokenTimeout);

    ctx.status=200;
    ctx.body={
        code: 1,
        message: 'token is created',
        token,
    };
};

const handlePostDeclareUploadOver=async(ctx)=>{
    [ok, user]=await checkUser(ctx);

    if(!ok)
    {
        ctx.status=401;
        ctx.body={
            code: 2,
            message: 'is not login',
        };
        return;
    }

    const token=ctx.request.body.token;

    if(!token)
    {
        ctx.status=400;
        ctx.body={
            code: 3,
            message: 'lack info',
        };
        return;
    }

    const tokenContent=uploadToken.get(token);

    if(!tokenContent)
    {
        ctx.status=400;
        ctx.body={
            code: 4,
            message: 'invalid token',
        };
        return;
    }

    //console.log(tokenContent);

    if(tokenContent.currentFilesNum!==tokenContent.filesNum)
    {
        const newUploadFiles=await UploadFiles.findById(tokenContent.UploadFilesId);

        const files=newUploadFiles.files;

        for(let i=0; i<files.length; i++)
        {
            const file=await File.findById(files[i]);

            const filePath=file.filePath;

            fs.unlink(filePath, (err)=>{
                if(err)
                {
                    console.log(err);
                }
            });

            await file.deleteOne();
        }

        await newUploadFiles.deleteOne();

        ctx.status=400;
        ctx.body={
            code: 5,
            message: `server destroy the uploaded files as the files' num is not enough`,
        };
        return;
    }

    uploadToken.delete(token);

    ctx.status=200;
    ctx.body={
        code: 1,
        message: 'files upload is over',
    };
};

const handlePostUploadFiles=async(ctx)=>{
    [ok, user]=await checkUser(ctx);

    if(!ok)
    {
        ctx.status=401;
        ctx.body={
            code: 6,//接着cheker的code排
            message: 'is not login',
        };
        return;
    }

    //const {files, fields}=ctx.request;//request对象的files属性是上传的文件 fields是表单的字段
    //console.log(files, fields)
    //const title=fields.title && fields.title[0];
    if(!ctx.request.files)
    {
        ctx.status=400;
        ctx.body={
            code: 2,
            message: 'lack info',
        };
        return;
    }

    const file=ctx.request.files.file;
    const token=ctx.request.body.token;

    const tokenContent=uploadToken.get(token);

    const newUploadFiles=await UploadFiles.findById(tokenContent.UploadFilesId);

    const filePath=path.join(__dirname, '../../uplaods', file.newFilename);//获取文件路径

    const newFileData=new File({//保存到数据库
        filename: file.newFilename,
        originalFilename: file.originalFilename,
        filePath,
        size: file.size,
    });
    await newFileData.save();

    //console.log(newFileData);

    newUploadFiles.files.push(newFileData._id);
    await newUploadFiles.save();

    ctx.status=200;
    ctx.body={
        code: 1,
        message: 'file is uploaded successfully',
    };
};

module.exports={ handlePostUploadText, handlePostUploadFiles, handlePostRequireUploadToken, handlePostDeclareUploadOver };