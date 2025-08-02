import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Please provide a valid database URI");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to database in", NODE_ENV, "Mode");
        
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}

export default connectToDatabase;
