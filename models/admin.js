import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}
    ,
    {
        timestamps: true
    });

export const Admin = mongoose.model('admins', adminSchema);