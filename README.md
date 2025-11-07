# ShopSphere E-commerce

A modern e-commerce application built with Next.js 15 and Tailwind CSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update environment variables in `.env.local` with your actual values.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── api/           # API routes
├── components/    # React components
│   └── ui/       # Reusable UI components
├── lib/          # Utility libraries
├── utils/        # Helper functions
├── globals.css   # Global styles
├── layout.js     # Root layout
└── page.js       # Home page
```

## Features

- Responsive design with Tailwind CSS
- Product carousel
- API routes for products
- Reusable UI components
- Environment configuration

## Environment Variables

See `.env.local` for required environment variables.