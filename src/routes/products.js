const express = require('express')
const router = express.Router()

const Product = require('../app/models/product')

router.get('/', (req, res) => {
    Product.find((err, products) => {
        if (err) res.send(err)

        res.status(200).json({
            message:'Products returned.',
            products
        })
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params

    Product.findById(id, (err, product) => {
        if (err) 
            res.status(500).json({
                message: '[Error] Malformed id',
                error: err,
            })

        else if (!product) 
            res.status(400).json({
                message: 'Product not found',
            })

        else
            res.status(200).json({
                message: 'Product returned.',
                product,
            })
    })
})

router.post('/', (req, res) => {
    const { name, price, description } = req.body
    const product = new Product()

    product.name = name
    product.price = price
    product.description = description

    product.save(error => {
        if (error) 
            res.status(500).json({ 
                message: '[Error] failed to save product: ',
                error, 
            })

        res.status(201).json({ message: 'Product created succesfully!' })
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params

    Product.findById(id, (err, product) => {
        if (err) 
            res.status(500).json({
                message: '[Error] Malformed id',
                error: err,
            })

        else if (!product) 
            res.status(400).json({
                message: 'Product not found',
            })

        else {
            const { name, price, description } = req.body

            product.name = name || product.name
            product.price = price || product.price
            product.description = description || product.description

            product.save(error => {
                if (error) 
                    res.status(500).json({
                        message: '[Error] Failed to update product',
                    })
                else
                    res.status(200).json({
                        message: 'Product updated successfuly.'
                    })
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    Product.findByIdAndRemove(id, (err, product) => {
        if (err)
            return res.status(500).json({
                message: '[Error] failed to delete',
                error: err
            })
    
        const response = {
            message: 'Product deleted successfuly',
            productId: product.id,
        }

        return res.status(200).json(response)
    })
})

module.exports = router
