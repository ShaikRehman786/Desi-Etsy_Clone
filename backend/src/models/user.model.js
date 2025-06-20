const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true, select:false},
    role:{type:String, enum:['Customer', 'Artisan', 'Admin'], default:'Customer'},
    isApproved:{type:Boolean, default:false},

    // oauth

},
{timestamps:true}
);


// hashing the password before save

// userSchema.pre('save', async function () {
//     if(!this.isModified('password')) return;
//     this.password = await bcrypt.hash(this.password, 10)
// });


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // Skip hashing for Google OAuth placeholder password
    if (this.password === 'google_oauth_user') return;

    this.password = await bcrypt.hash(this.password, 10);
});



// compare password helper

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};


module.exports = mongoose.model('User', userSchema);





