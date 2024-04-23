const Brand = require('../models/brand')

// jobsController.js

// Create a new job
exports.createBrand = async (req, res) => {
    try {
        const getbrand = await Brand.findOne({title:req.body.title})
        if (getbrand) {
            res.status(500).send({status:false,message:'same Brand Name already added'});
            return
        }
        const brand = new Brand(req.body);
        await brand.save();
        res.status(201).send({status:true,brand});
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get category
exports.getBrand = async (req, res) => {
    try {
        const brand = await Brand.find();
        res.status(200).send({status:true,result:brand});
    } catch (error) {
        res.status(500).send(error);
    }
};

// edit title of category
exports.editBrand = async (req, res) => {
    try {
        await Brand.findByIdAndUpdate({ _id: req.params.id },req.body.title)
        res.status(200).send({status:true,message:"Successfully edited"});
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        await Brand.findByIdAndDelete({ _id: req.params.id })
        res.status(200).send({status:true,message:"Successfully deleted"});
    } catch (error) {
        res.status(500).send(error);
    }
};