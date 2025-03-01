const mongoose=require('mongoose');

const UploadFilesSchema = new mongoose.Schema({
    title: { type: String, required: true },  // 上传的标题
    text: { type: String, required: true},
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true}],  // 包含多个文件信息
    size: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },  // 上传记录的时间
    userObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likeNum: {type: Number, default: 0},
    dislikeNum: {type: Number, default: 0},
    viewNum: {type: Number, default: 0},
    downloadNum: {type: Number, default: 0,},
});

UploadFilesSchema.statics.findByUserId = async function(userObjectId){
    return await this.find({ userObjectId: userObjectId });
};

const UploadFiles = mongoose.model('UploadFiles', UploadFilesSchema);

module.exports=UploadFiles;