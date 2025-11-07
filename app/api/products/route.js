import { NextResponse } from 'next/server';

// Indian products with multi-lingual support
const indianProducts = [
  {
    id: 1,
    name: {
      en: 'Basmati Rice Premium',
      hi: 'बासमती चावल प्रीमियम',
      ta: 'பாஸ்மதி அரிசி பிரீமியம்',
      kn: 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ ಪ್ರೀಮಿಯಂ'
    },
    price: 299,
    originalPrice: 399,
    category: 'Groceries',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Premium quality basmati rice from Punjab',
      hi: 'पंजाब से प्रीमियम गुणवत्ता बासमती चावल',
      ta: 'பஞ்சாபிலிருந்து பிரீமியம் தரமான பாஸ்மதி அரிசி',
      kn: 'ಪಂಜಾಬ್‌ನಿಂದ ಪ್ರೀಮಿಯಂ ಗುಣಮಟ್ಟದ ಬಾಸ್ಮತಿ ಅಕ್ಕಿ'
    },
    variants: ['1kg', '5kg', '10kg'],
    colors: ['White'],
    sizes: ['1kg', '5kg', '10kg']
  },
  {
    id: 2,
    name: {
      en: 'Cotton Kurta Set',
      hi: 'कॉटन कुर्ता सेट',
      ta: 'காட்டன் குர்தா செட்',
      kn: 'ಕಾಟನ್ ಕುರ್ತಾ ಸೆಟ್'
    },
    price: 899,
    originalPrice: 1299,
    category: 'Clothing',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Comfortable cotton kurta with matching pajama',
      hi: 'मैचिंग पजामे के साथ आरामदायक कॉटन कुर्ता',
      ta: 'பொருந்தும் பஜாமாவுடன் வசதியான காட்டன் குர்தா',
      kn: 'ಹೊಂದಾಣಿಕೆಯ ಪಜಾಮಾದೊಂದಿಗೆ ಆರಾಮದಾಯಕ ಕಾಟನ್ ಕುರ್ತಾ'
    },
    variants: ['Regular', 'Slim Fit'],
    colors: ['White', 'Blue', 'Cream', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 3,
    name: {
      en: 'Pressure Cooker 5L',
      hi: 'प्रेशर कुकर 5 लीटर',
      ta: 'பிரஷர் குக்கர் 5 லிட்டர்',
      kn: 'ಪ್ರೆಶರ್ ಕುಕರ್ 5 ಲೀಟರ್'
    },
    price: 1899,
    originalPrice: 2499,
    category: 'Kitchen',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Stainless steel pressure cooker with safety valve',
      hi: 'सेफ्टी वाल्व के साथ स्टेनलेस स्टील प्रेशर कुकर',
      ta: 'பாதுகாப்பு வால்வுடன் ஸ்டெயின்லெஸ் ஸ்டீல் பிரஷர் குக்கர்',
      kn: 'ಸುರಕ್ಷತಾ ವಾಲ್ವ್‌ನೊಂದಿಗೆ ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ಪ್ರೆಶರ್ ಕುಕರ್'
    },
    variants: ['3L', '5L', '7L'],
    colors: ['Silver'],
    sizes: ['3L', '5L', '7L']
  },
  {
    id: 4,
    name: {
      en: 'Ayurvedic Face Cream',
      hi: 'आयुर्वेदिक फेस क्रीम',
      ta: 'ஆயுர்வேத முக கிரீம்',
      kn: 'ಆಯುರ್ವೇದಿಕ್ ಫೇಸ್ ಕ್ರೀಮ್'
    },
    price: 449,
    originalPrice: 599,
    category: 'Beauty',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Natural ayurvedic face cream with turmeric and neem',
      hi: 'हल्दी और नीम के साथ प्राकृतिक आयुर्वेदिक फेस क्रीम',
      ta: 'மஞ்சள் மற்றும் வேப்பத்துடன் இயற்கை ஆயுர்வேத முக கிரீம்',
      kn: 'ಅರಿಶಿಣ ಮತ್ತು ಬೇವಿನೊಂದಿಗೆ ನೈಸರ್ಗಿಕ ಆಯುರ್ವೇದಿಕ್ ಫೇಸ್ ಕ್ರೀಮ್'
    },
    variants: ['50g', '100g'],
    colors: ['Natural'],
    sizes: ['50g', '100g']
  },
  {
    id: 5,
    name: {
      en: 'Cricket Bat Kashmir Willow',
      hi: 'क्रिकेट बैट कश्मीर विलो',
      ta: 'கிரிக்கெட் பேட் காஷ்மீர் வில்லோ',
      kn: 'ಕ್ರಿಕೆಟ್ ಬ್ಯಾಟ್ ಕಾಶ್ಮೀರ್ ವಿಲೋ'
    },
    price: 2499,
    originalPrice: 3299,
    category: 'Sports',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Professional cricket bat made from Kashmir willow',
      hi: 'कश्मीर विलो से बना प्रोफेशनल क्रिकेट बैट',
      ta: 'காஷ்மீர் வில்லோவில் செய்யப்பட்ட தொழில்முறை கிரிக்கெட் பேட்',
      kn: 'ಕಾಶ್ಮೀರ್ ವಿಲೋದಿಂದ ತಯಾರಿಸಿದ ವೃತ್ತಿಪರ ಕ್ರಿಕೆಟ್ ಬ್ಯಾಟ್'
    },
    variants: ['Junior', 'Senior'],
    colors: ['Natural Wood'],
    sizes: ['Size 1', 'Size 2', 'Size 3', 'Size 4', 'Size 5', 'Size 6']
  },
  {
    id: 6,
    name: {
      en: 'Masala Chai Tea Bags',
      hi: 'मसाला चाय टी बैग्स',
      ta: 'மசாலா சாய் டீ பேக்ஸ்',
      kn: 'ಮಸಾಲಾ ಚಾಯ್ ಟೀ ಬ್ಯಾಗ್ಸ್'
    },
    price: 199,
    originalPrice: 249,
    category: 'Beverages',
    image: '/api/placeholder/300/300',
    description: {
      en: 'Authentic Indian masala chai tea bags with spices',
      hi: 'मसालों के साथ प्रामाणिक भारतीय मसाला चाय टी बैग्स',
      ta: 'மசாலாக்களுடன் உண்மையான இந்திய மசாலா சாய் டீ பேக்ஸ்',
      kn: 'ಮಸಾಲೆಗಳೊಂದಿಗೆ ಅಧಿಕೃತ ಭಾರತೀಯ ಮಸಾಲಾ ಚಾಯ್ ಟೀ ಬ್ಯಾಗ್ಸ್'
    },
    variants: ['25 bags', '50 bags', '100 bags'],
    colors: ['Brown'],
    sizes: ['25 bags', '50 bags', '100 bags']
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    // Localize product names and descriptions
    const localizedProducts = indianProducts.map(product => ({
      ...product,
      name: product.name[lang] || product.name.en,
      description: product.description[lang] || product.description.en,
      formattedPrice: `₹${product.price.toLocaleString('en-IN')}`,
      formattedOriginalPrice: `₹${product.originalPrice.toLocaleString('en-IN')}`,
      discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }));
    
    return NextResponse.json(localizedProducts);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products. Please try again later.' 
    }, { status: 500 });
  }
}