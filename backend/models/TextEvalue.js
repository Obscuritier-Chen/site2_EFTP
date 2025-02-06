const mongoose=require('mongoose');

const TextEvalueSchema=new mongoose.Schema({
    evaluation: {type: String, enum: ['like', 'dislike'], required: true},
    textObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'UploadText', required: true},
    userObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
});

const TextEvalue=mongoose.model('TextEvalue', TextEvalueSchema);

TextEvalue.createIndexes({textObjectId: 1, userObjectId: 1}, {unique: true});

module.exports=TextEvalue;