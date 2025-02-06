const mongoose=require('mongoose');

const FilesEvalueSchema=new mongoose.Schema({
    evaluation: {type: String, enum: ['like', 'dislike'], required: true},
    filesObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'UploadText', required: true},
    userObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
});

const FilesEvalue=mongoose.model('FilesEvalue', FilesEvalueSchema);

FilesEvalue.createIndexes({filesObjectId: 1, userObjectId: 1}, {unique: true});

module.exports=FilesEvalue;