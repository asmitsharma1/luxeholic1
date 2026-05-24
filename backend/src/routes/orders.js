import express from 'express';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, userId } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Order items are required'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Mock order creation
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      shippingAddress,
      total,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Mock orders
    const mockOrders = [
      {
        id: 'ORD-1234567890',
        userId,
        items: [
          {
            id: '1',
            name: 'Luxury Handbag',
            price: 2500,
            quantity: 1
          }
        ],
        total: 2500,
        status: 'delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Get single order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Mock order
    const mockOrder = {
      id: orderId,
      items: [
        {
          id: '1',
          name: 'Luxury Handbag',
          brand: 'Gucci',
          price: 2500,
          quantity: 1,
          image: '/products/p1.jpg'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      total: 2500,
      currency: 'USD',
      status: 'processing',
      createdAt: new Date().toISOString(),
      trackingNumber: 'TRK123456789'
    };

    res.json({
      success: true,
      data: mockOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    res.json({
      success: true,
      data: {
        orderId,
        status,
        updatedAt: new Date().toISOString()
      },
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

export default router;
