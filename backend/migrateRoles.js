import mongoose from "mongoose";
import { User } from "./model/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // Update all users who currently have the "recruiter" string explicitly saved in the DB to "admin"
        const result = await User.updateMany(
            { role: "recruiter" },
            { $set: { role: "admin" } }
        );

        console.log(`Migration complete. Modified ${result.modifiedCount} users.`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

migrate();
