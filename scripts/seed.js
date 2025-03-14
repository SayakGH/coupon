const { MongoClient } = require('mongodb');

async function seedDatabase() {
  const uri = 'mongodb+srv://sayak:Sayak24@cluster0.umazb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('coupon-system');
    
    // Check if coupons already exist
    const existingCoupons = await db.collection('coupons').countDocuments();
    
    if (existingCoupons === 0) {
      // Sample coupons
      const coupons = [
        {
          code: 'DISCOUNT10',
          description: '10% off your next purchase',
          active: true,
          created: new Date()
        },
        {
          code: 'FREESHIP',
          description: 'Free shipping on orders over $50',
          active: true,
          created: new Date()
        },
        {
          code: 'BOGO50',
          description: 'Buy one get one 50% off',
          active: true,
          created: new Date()
        },
        {
          code: 'WELCOME20',
          description: '20% off for new customers',
          active: true,
          created: new Date()
        },
        {
          code: 'HOLIDAY25',
          description: '25% off holiday items',
          active: true,
          created: new Date()
        }
      ];
      
      // Insert coupons
      const result = await db.collection('coupons').insertMany(coupons);
      console.log(`${result.insertedCount} coupons inserted`);
    } else {
      console.log('Database already seeded');
    }

  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedDatabase().catch(console.error);