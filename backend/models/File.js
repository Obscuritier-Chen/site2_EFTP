const mongoose=require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },  // 文件名
    originalFilename: { type: String, required: true },  // 原始文件名
    filePath: { type: String, required: true },  // 文件保存的路径
    size: { type: Number, required: true },  // 文件大小
    createdAt: { type: Date, default: Date.now },  // 文件上传时间
});

const File=mongoose.model('File', fileSchema);

module.exports=File;