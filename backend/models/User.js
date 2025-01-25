const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['normal_user', 'contributor', 'pro_contributor', 'admin'],
        default: 'normal_user',
    }
});

UserSchema.pre('save',async function (next){
    if(this.isModified('password'))
    {
        const salt=await bcrypt.genSalt(10);//增强hash字符串
        this.password=await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.comparePassword=async function(receivedPassword){
    return await bcrypt.compare(receivedPassword, this.password);
};

// 为 uid 字段设置自动递增
UserSchema.plugin(AutoIncrement, { inc_field: 'uid' });

const User = mongoose.model('User', UserSchema);

module.exports=User;