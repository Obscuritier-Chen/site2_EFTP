const mongoose=require('mongoose');

const UploadTextSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    userObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } //一个ObjectId类型 关联了User模型 可以通过这个直接查询到user
});

UploadTextSchema.statics.findByUserId = async function(userObjectId){
    return await this.find({ userObjectId: userObjectId });
};
  
const UploadText = mongoose.model('UploadText', UploadTextSchema);
  
module.exports=UploadText;