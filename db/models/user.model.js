const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error("Invalid Email")
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        maxlength: 100,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, ['ar-EG'])) throw new Error("invalid phone number")
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    status: { 
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        trim: true,
        enum: ['user', 'admin'],
        required: true
    },
    image: [
        {
            type: String,
            trim: true,
            required: true
        }
    ],
    album: [
        { 
            imageId: { 
                type: Schema.Types.ObjectId, 
                ref: "Album",
                required: true 
            } 
        }
    ],
    comment: { type: String, trim: true },
    
    tokens: [ { token: { type: String, required: true } } ]
},
    {timestamps:true}
)

userSchema.virtual('myAlbum', {
    ref: "Album",
    localField: "_id",
    foreignField: "userId"
})

userSchema.methods.toJSON = function(){
    const data = this.toObject()
    delete data.password
    delete data.__v
    delete data.tokens
    if(data.userType == 'admin' || data.userType == 'user'){
        delete data.images 
        delete data.album 
    }
    return data
}

userSchema.pre("save", async function(){
    let user = this
    if(user.isModified("password")) user.password = await bcrypt.hash(user.password, 12)
})

userSchema.statics.loginUser = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error("Email Not Found")
    const isValidPass = await bcrypt.compare(password, user.password)
    if(!isValidPass) throw new Error("invalid password")
    return user
}

userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWTTOKEN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


const User = mongoose.model('User', userSchema)
module.exports = User