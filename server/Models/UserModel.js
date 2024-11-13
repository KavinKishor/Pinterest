const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    followingPic:[{type:mongoose.Schema.Types.ObjectId,ref:"Picture"}]
})

const User = mongoose.model("user-collection",userSchema)

module.exports = User