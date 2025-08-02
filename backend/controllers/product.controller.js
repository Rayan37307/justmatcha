import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json({success: true, message: "Products fetched successfully", data: products})
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product) {
            const error = new Error("Product not found")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({success: true, message: "Product fetched successfully", data: product})
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const {name, description, price, stock, image} = req.body
        const product = new Product({name, description, price, stock: stock, image})
        await product.save()

        res.status(201).json({success: true, message: "Product created successfully", data: product})
    } catch (error) {
        next(error)
    }
}
export const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const {name, description, price, stock, image} = req.body
        const updatedProduct = await Product.findByIdAndUpdate(id, {name: name, description: description, price: price, stock: stock, image: image}, {new: true})
        if(!updatedProduct) {
            const error = new Error("Product not found")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({success: true, message: "Product updated successfully", data: updatedProduct})
    } catch (error) {
        next(error)
    }
}
export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const deletedProduct = await Product.findByIdAndDelete(id)
        if(!deletedProduct) {
            const error = new Error("Product not found")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({success: true, message: "Product deleted successfully", data: deletedProduct})
    } catch (error) {
        next(error)
    }
}
