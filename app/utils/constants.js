export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'ShopSphere',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'An e-commerce store built with Next.js and Tailwind CSS.',
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};