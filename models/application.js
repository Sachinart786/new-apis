import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
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

export const Application = mongoose.model('applications', applicationSchema);