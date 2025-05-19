import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Tata Salt',
    description: 'Vacuum evaporated iodized salt with free-flowing properties, trusted by millions of Indian families.',
    price: 24,
    mrp: 25,
    discount: 4,
    image: 'https://th.bing.com/th/id/OIP.32_m5EniVsIB7sY_Qw7EFgHaIq?w=150&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Tata',
    category: 'Groceries',
    subcategory: 'Salt & Sugar',
    stock: 100,
    rating: 4.8,
    reviews: 2456,
    isPopular: true,
    barcode: '8901232123457',
    unit: 'pack',
    weight: '1 kg',
    tags: ['salt', 'iodized', 'cooking essentials']
  },
  {
    id: 'prod-2',
    name: 'Amul Gold Milk',
    description: 'Pasteurized and homogenized full cream milk with 6% fat content for a rich and creamy taste.',
    price: 68,
    mrp: 70,
    discount: 3,
    image: 'https://th.bing.com/th/id/OIP.JAP08MD_0jVq-1T7YgEVLgHaHa?w=159&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Amul',
    category: 'Dairy Products',
    subcategory: 'Milk',
    stock: 50,
    rating: 4.7,
    reviews: 1893,
    isPopular: true,
    barcode: '8901425632175',
    unit: 'pack',
    weight: '500 ml',
    nutrition: {
      calories: 117,
      protein: 7.7,
      carbs: 12.3,
      fat: 3.5
    },
    tags: ['milk', 'fresh', 'dairy']
  },
  {
    id: 'prod-3',
    name: 'Aashirvaad Atta',
    description: 'Whole wheat flour made from the finest grains, perfect for soft and fluffy rotis.',
    price: 350,
    mrp: 350,
    discount: 7,
    image: 'https://th.bing.com/th/id/OIP.B-CUuME-IzismtBAqm00WQHaHa?w=220&h=220&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Aashirvaad',
    category: 'Groceries',
    subcategory: 'Atta & Flours',
    stock: 75,
    rating: 4.6,
    reviews: 3124,
    isPopular: true,
    barcode: '8909081002779',
    unit: 'pack',
    weight: '5 kg',
    nutrition: {
      calories: 340,
      protein: 12,
      carbs: 72,
      fat: 1.5
    },
    tags: ['atta', 'wheat', 'flour', 'chapati']
  },
  {
    id: 'prod-4',
    name: 'Maggi 2-Minute Noodles',
    description: 'Instant noodles with magical masala flavor, ready in just 2 minutes.',
    price: 14,
    mrp: 15,
    discount: 7,
    image: 'https://th.bing.com/th/id/OIP.9tiPNupvP2QZ8n29GqItuAHaHa?w=193&h=193&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Nestle',
    category: 'Snacks & Beverages',
    subcategory: 'Noodles & Pasta',
    stock: 200,
    rating: 4.5,
    reviews: 5678,
    isPopular: true,
    barcode: '8901058831429',
    unit: 'pack',
    weight: '70g',
    nutrition: {
      calories: 280,
      protein: 6,
      carbs: 36,
      fat: 12
    },
    tags: ['noodles', 'instant', 'quick meal', 'snack']
  },
  {
    id: 'prod-5',
    name: 'Vim Dishwash Liquid',
    description: 'Powerful dish cleaning bar that removes tough grease and gives a sparkling clean finish.',
    price: 110,
    mrp: 110,
    image: 'https://th.bing.com/th/id/OIP.bh5vb9b85pzs-uoto2Hr-gHaHa?w=206&h=206&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Vim',
    category: 'Home Care',
    subcategory: 'Dishwashing',
    stock: 150,
    rating: 4.3,
    reviews: 1245,
    barcode: '8901030711572',
    unit: 'piece',
    weight: '200g',
    tags: ['dishwash', 'cleaning', 'kitchen']
  },
  {
    id: 'prod-6',
    name: 'Surf Excel Easy Wash',
    description: 'Detergent liquid with superior stain removal technology for an effortless wash.',
    price: 110,
    mrp: 120,
    discount: 8,
    image: 'https://th.bing.com/th/id/OIP.1Vtswqj5dM2xhXfP41ZpzwHaHa?w=174&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Surf Excel',
    category: 'Home Care',
    subcategory: 'Laundry',
    stock: 85,
    rating: 4.6,
    reviews: 2389,
    barcode: '8901030454578',
    unit: 'pack',
    weight: '1 kg',
    tags: ['detergent', 'laundry', 'stain removal']
  },
  {
    id: 'prod-7',
    name: 'Britannia Good Day Cookies',
    description: 'Crunchy butter cookies with a rich taste that makes for a perfect tea-time snack.',
    price: 30,
    mrp: 35,
    discount: 14,
    image: 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    brand: 'Britannia',
    category: 'Snacks & Beverages',
    subcategory: 'Biscuits & Cookies',
    stock: 120,
    rating: 4.4,
    reviews: 1876,
    isPopular: true,
    barcode: '8901063123784',
    unit: 'pack',
    weight: '200g',
    nutrition: {
      calories: 486,
      protein: 6.7,
      carbs: 67.4,
      fat: 21.3
    },
    tags: ['cookies', 'biscuits', 'snack', 'tea-time']
  },
  {
    id: 'prod-8',
    name: 'Fresh Tomatoes',
    description: 'Vine-ripened fresh tomatoes, perfect for curries, salads, and chaats.',
    price: 40,
    mrp: 45,
    discount: 11,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    brand: 'Local Farms',
    category: 'Fruits & Vegetables',
    subcategory: 'Vegetables',
    stock: 60,
    rating: 4.2,
    reviews: 945,
    barcode: '8901700123456',
    unit: 'kg',
    weight: '1 kg',
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2
    },
    tags: ['vegetables', 'fresh', 'tomatoes']
  },
  {
    id: 'prod-9',
    name: 'Dettol Handwash',
    description: 'Antibacterial hand wash that protects against germs and keeps hands clean and fresh.',
    price: 99,
    mrp: 110,
    discount: 10,
    image: 'https://www.netmeds.com/images/product-v1/600x600/1074728/dettol_original_liquid_handwash_675_ml_519809_0_1.jpg',
    brand: 'Dettol',
    category: 'Personal Care',
    subcategory: 'Hand Wash',
    stock: 90,
    rating: 4.7,
    reviews: 2190,
    barcode: '8901396321548',
    unit: 'bottle',
    weight: '200 ml',
    tags: ['handwash', 'hygiene', 'antibacterial']
  },
  {
    id: 'prod-10',
    name: 'Oreo Biscuits',
    description: 'India\'s favorite glucose biscuits loved by generations, perfect with chai.',
    price: 50,
    mrp: 50,
    image: 'https://th.bing.com/th/id/OIP.RTzGiIJsJBnwt-ZvCDCKmgHaHa?w=193&h=193&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    brand: 'Oreo',
    category: 'Snacks & Beverages',
    subcategory: 'Biscuits & Cookies',
    stock: 250,
    rating: 4.8,
    reviews: 8765,
    isPopular: true,
    barcode: '8901063010245',
    unit: 'pack',
    weight: '70g',
    nutrition: {
      calories: 429,
      protein: 7,
      carbs: 69,
      fat: 15
    },
    tags: ['biscuits', 'glucose', 'chai']
  }
];

// Function to get recommended products based on a category
export const getRecommendedProducts = (category: string): Product[] => {
  return products.filter(product => product.category === category).slice(0, 4);
};

// Function to get popular products 
export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.isPopular).slice(0, 6);
};

// Function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Function to get product by barcode
export const getProductByBarcode = (barcode: string): Product | undefined => {
  return products.find(product => product.barcode === barcode);
};

// Function to search products
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) || 
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.brand.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery) ||
    (product.subcategory && product.subcategory.toLowerCase().includes(lowerCaseQuery)) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
  );
};