const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Get all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a product (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, price, section, originalPrice, description, rating, stock, images, details, availableSizes, externalLink } = req.body;
    if (!name || !price || !section) {
      return res.status(400).json({ error: 'Name, price, and section are required' });
    }

    const product = await prisma.product.create({
      data: { 
        name, 
        price, 
        section,
        originalPrice: originalPrice || null,
        description: description || null,
        rating: rating ? parseFloat(rating) : null,
        stock: stock ? parseInt(stock) : 0,
        images: images ? images : [],
        details: details || null,
        externalLink: externalLink || null,
        availableSizes: availableSizes || ["S", "M", "L", "XL"]
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Update a product (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { name, price, section, originalPrice, description, rating, stock, images, details, availableSizes, externalLink } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, 
        price, 
        section,
        originalPrice: originalPrice || null,
        description: description || null,
        rating: rating ? parseFloat(rating) : null,
        stock: stock ? parseInt(stock) : 0,
        images: images ? images : [],
        details: details || null,
        externalLink: externalLink || null,
        availableSizes: availableSizes || ["S", "M", "L", "XL"]
      }
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Delete a product (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
