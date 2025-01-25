const Router=require('koa-router');
const koaBody=require('koa-body').default;
const uuid=require('uuid');
const path=require('path');
const {handlePostUploadText, handlePostUploadFiles,handlePostRequireUploadToken,handlePostDeclareUploadOver}=require('./controller');
const {checkFileUploadMiddleware}=require('./file_upload_cheker_middleware');

const router=new Router();


router.post('/postText', koaBody({multipart: true}), handlePostUploadText);
router.post('/postFiles/require', koaBody({multipart: true}), handlePostRequireUploadToken);
router.post('/postFiles/upload',
    checkFileUploadMiddleware,
    handlePostUploadFiles
);
router.post('/postFiles/over', koaBody({multipart: true}), handlePostDeclareUploadOver);

module.exports=router;