import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    logo: {
        type: String,

    },
    about: {
        type: String,
    },
    pptLink: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    socials: {
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        website: { type: String, default: "" }
    }
}, { timestamps: true });
export const Company = mongoose.model('Company', companySchema);
