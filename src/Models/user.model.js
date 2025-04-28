import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {type    : String, required: true, unique: true},
    password: {type: String, required: true},
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '',
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
})
const User = mongoose.model('User', userSchema);
export default User;