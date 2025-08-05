import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/env.js"
import bcrypt from 'bcrypt'

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (returns an array)
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        const newUser = newUsers[0]; // ✅ get user from array

        const token = jwt.sign(
            { userId: newUser._id, isAdmin: newUser.isAdmin },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction(); // ✅ wait here too
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }

        const isPassWordValid = await bcrypt.compare(password, user.password)

        if(!isPassWordValid) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({userId: user._id, isAdmin: user.isAdmin}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: user
            }
        })
        
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "User signed out successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if(!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        next(error)
    }
}