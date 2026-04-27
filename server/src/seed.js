const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./modules/product/product.model');
const User = require('./modules/user/user.model');

dotenv.config();

const products = [
  {
    name: "Quantum Sound Pro Headphones",
    description: "Immerse yourself in pure audio bliss with the Quantum Sound Pro. Featuring active noise cancellation, 40-hour battery life, and high-fidelity drivers that deliver crisp highs and deep, resonant bass. Designed for comfort during long listening sessions with memory foam ear cushions.",
    price: 15999,
    category: "Electronics",
    brand: "QuantumAudio",
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", public_id: "seed_1" }],
    inventory: { totalStock: 45 },
    ratings: { average: 4.8, count: 128 }
  },
  {
    name: "Urban Explorer Backpack",
    description: "The ultimate companion for your daily commute or weekend adventures. Water-resistant ballistic nylon, a dedicated 16-inch laptop compartment, and an ergonomic suspension system make this backpack as functional as it is stylish. Features multiple hidden pockets for security.",
    price: 4499,
    category: "Fashion",
    brand: "NomadGoods",
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", public_id: "seed_2" }],
    inventory: { totalStock: 82 },
    ratings: { average: 4.5, count: 56 }
  },
  {
    name: "Minimalist Ceramic Watch",
    description: "A statement of elegance and precision. This timepiece features a scratch-resistant ceramic case, sapphire crystal glass, and a reliable Japanese quartz movement. The sleek, monochrome design fits perfectly with both formal and casual attire.",
    price: 8999,
    category: "Accessories",
    brand: "Zenith",
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", public_id: "seed_3" }],
    inventory: { totalStock: 15 },
    ratings: { average: 4.9, count: 42 }
  },
  {
    name: "Eco-Friendly Yoga Mat",
    description: "Crafted from natural tree rubber, our eco-friendly yoga mat provides superior grip and cushioning. Non-toxic, biodegradable, and features a beautiful laser-etched alignment guide to help you perfect your poses. Perfect for all levels of practice.",
    price: 2499,
    category: "Sports",
    brand: "PureMotion",
    images: [{ url: "https://images.unsplash.com/photo-1592432676556-38174f0bd9f1?w=800&q=80", public_id: "seed_4" }],
    inventory: { totalStock: 120 },
    ratings: { average: 4.7, count: 215 }
  },
  {
    name: "Lumina Smart Desk Lamp",
    description: "Upgrade your workspace with the Lumina Smart Lamp. Adjust color temperature from warm amber to cool daylight, control brightness via touch or voice assistants, and charge your phone wirelessly on the integrated Qi base. Flicker-free technology reduces eye strain.",
    price: 3299,
    category: "Home Decor",
    brand: "LuminaTech",
    images: [{ url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80", public_id: "seed_5" }],
    inventory: { totalStock: 30 },
    ratings: { average: 4.6, count: 89 }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Create/Find a seller
    let seller = await User.findOne({ email: 'seller@shopmart.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Official Shopmart Seller',
        email: 'seller@shopmart.com',
        password: 'password123',
        role: 'seller'
      });
      console.log('Created a seller user.');
    }
    
    await Product.deleteMany();
    console.log('Cleared existing products.');
    
    const productsWithSeller = products.map(p => ({ ...p, sellerId: seller._id }));
    
    await Product.insertMany(productsWithSeller);
    console.log('Seed data inserted successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
