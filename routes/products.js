const express = require("express");

const router = express.Router();

let products = [
    {
        id: 1,
        name: "Halo Glow Liquid Filter",
        category: "Face",
        shade: "2 Fair/Light",
        price: 430,
        image: ""
    },

    {
        id: 2,
        name: "Camo Liquid Blush",
        category: "Face",
        shade: "Cheeky Lychee",
        price: 220,
        image: ""
    },

    {
        id: 3,
        name: "Power Grip Primer",
        category: "Primer",
        shade: "Clear",
        price: 300,
        image: ""
    }
];

// GET PRODUCTS
router.get("/", (req, res) => {
    res.json(products);
});

// ADD PRODUCT
router.post("/", (req, res) => {

    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        category: req.body.category,
        shade: req.body.shade,
        price: req.body.price,
        image: req.body.image
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

module.exports = router;