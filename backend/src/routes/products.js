import express from 'express';
import axios from 'axios';

const router = express.Router();

// BrandsGateway API configuration
const BRANDSGATEWAY_API_URL = 'https://api.brandsgateway.com/v1';

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, brand, limit = 20, page = 1 } = req.query;
    
    const params = {
      limit,
      page,
      ...(category && { category }),
      ...(brand && { brand })
    };

    // Mock response for now - replace with actual BrandsGateway API call
    const mockProducts = [
      {
        id: '1',
        name: 'Luxury Handbag',
        brand: 'Gucci',
        price: 2500,
        currency: 'USD',
        category: 'bags',
        image: '/products/p1.jpg',
        description: 'Premium leather handbag'
      },
      {
        id: '2',
        name: 'Designer Shoes',
        brand: 'Prada',
        price: 1200,
        currency: 'USD',
        category: 'shoes',
        image: '/products/p2.jpg',
        description: 'Elegant designer shoes'
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockProducts.length
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock response - replace with actual API call
    const mockProduct = {
      id,
      name: 'Luxury Handbag',
      brand: 'Gucci',
      price: 2500,
      currency: 'USD',
      category: 'bags',
      image: '/products/p1.jpg',
      description: 'Premium leather handbag with gold hardware',
      sizes: ['Small', 'Medium', 'Large'],
      colors: ['Black', 'Brown', 'Beige'],
      inStock: true
    };

    res.json({
      success: true,
      data: mockProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Mock search results
    const mockResults = [
      {
        id: '1',
        name: 'Luxury Handbag',
        brand: 'Gucci',
        price: 2500,
        image: '/products/p1.jpg'
      }
    ];

    res.json({
      success: true,
      data: mockResults,
      query: q
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search products'
    });
  }
});

export default router;
