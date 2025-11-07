# MINI PROJECT BCS586
**DEPT. of CS&E, KVGCE, SULLIA, D.K**

## ABSTRACT

The project "E-Commerce Customer Behavior and Sales Trend Analysis with Interactive Dashboard" focuses on developing a comprehensive analytics system for e-commerce platforms to enhance business decision-making through data-driven insights. With the rapid growth of online shopping, understanding customer behavior, sales patterns, and promotional effectiveness has become essential for maintaining competitiveness. 

This project integrates **Node.js with Express** for backend processing, **MySQL** for database management, and **Next.js with React** for frontend visualization to create a seamless and interactive dashboard. The system collects transactional data, customer information, and product details, allowing administrators to monitor key performance indicators such as top revenue-generating customers, bestselling products, and sales trends on an hourly and monthly basis.

Seasonal and festival promotions are analyzed to quantify their impact on revenue, enabling e-commerce companies to plan marketing strategies more effectively. Additionally, RFM (Recency, Frequency, Monetary) analysis is implemented to segment customers into categories such as Loyal, Occasional, and One-time, facilitating targeted marketing campaigns and customer retention strategies.

The platform supports real-time dataset uploads, automated computation of metrics, and the generation of downloadable reports in CSV or Excel formats, providing administrators with actionable insights at their fingertips. By combining backend data processing with frontend visualization, the system ensures that insights are not only accurate but also easily interpretable through interactive charts and graphs.

---

## CHAPTER 1: INTRODUCTION

In today's fast-paced digital world, online shopping has become an integral part of everyday life. E-commerce, or electronic commerce, refers to the buying and selling of goods and services over the internet, and it has transformed the traditional retail landscape by making it more accessible, convenient, and efficient.

The aim of this e-commerce project is to develop a fully functional online shopping platform that simulates a real-world marketplace. This platform is designed to cater to both customers and administrators, providing a comprehensive environment for seamless digital transactions.

From a technical perspective, this project demonstrates the practical application of modern web development technologies. The front-end of the platform is designed using **Next.js with React**, ensuring a responsive, visually appealing, and user-friendly interface. The back-end is developed using **Node.js with Express** and databases to handle data storage, retrieval, and secure transaction processing.

### 1.1 Objectives of the E-Commerce Dashboard

The primary objective is to deliver a comprehensive analytics solution through an interactive dashboard:

• **Sales Monitoring**: Enable e-commerce administrators to accurately track and visualize sales patterns hourly, daily, and monthly.

• **Entity Identification**: Identify and rank the top revenue-generating customers and top-selling products.

• **Campaign Evaluation**: Evaluate the effectiveness and return on investment of festival or promotional campaigns.

• **Customer Strategy**: Segment customers using the RFM methodology to formulate highly targeted marketing and retention strategies.

• **Visualization**: Provide a seamless, real-time, and interactive visualization layer using a web dashboard to support immediate, data-driven decision-making.

### 1.2 Scope of the Project

The project covers the development of an entire analytics workflow, from data ingestion to final presentation:

• **Data Storage and Management**: The system handles all core transactional data (Orders, Customers, Products). It utilizes a MySQL database for persistence and includes functionality to support the uploading of initial datasets in CSV format.

• **Backend Processing**: A **Node.js/Express** backend is responsible for all data processing. This includes data cleaning, aggregation, KPI computation, and advanced analytics (like RFM). The backend exposes secure REST APIs for all required data endpoints.

• **Frontend Visualization**: A dynamic, Single-Page Application (SPA) built with **Next.js and React** is the presentation layer. It consumes the backend APIs to display interactive charts, graphs, and reports of key metrics, sales trends, and customer segmentation results.

### 1.3 Problem Statement

Despite the abundance of transactional and behavioral data, many e-commerce platforms operate without a unified, efficient system to transform raw data into critical insights. This gap results in missed opportunities for strategic inventory management, personalized customer engagement, and data-backed decision-making.

---

## CHAPTER 2: LITERATURE SURVEY

[Literature survey content remains the same as it focuses on general e-commerce and AI concepts rather than specific technologies]

---

## CHAPTER 3: SYSTEM REQUIREMENTS

### 3.1 Hardware Requirements

#### 3.1.1 Server-side Requirements
• **Processor**: Intel i5 or equivalent minimum; Intel i7 or higher recommended
• **RAM**: Minimum 8 GB RAM; 16 GB or more recommended
• **Storage**: At least 500 GB HDD or 256 GB SSD; SSD preferred
• **Network**: High-speed internet connectivity with at least 10 Mbps
• **Backup System**: External hard drives or cloud storage solutions

#### 3.1.2 Client-side Requirements
• **Processor**: Intel i3 or equivalent minimum; Intel i5 or higher recommended
• **RAM**: Minimum 4 GB RAM; 8 GB recommended
• **Storage**: At least 100 GB free storage
• **Display**: Monitor resolution of 1366x768 pixels or higher
• **Internet**: Broadband with at least 4–10 Mbps

### 3.2 Software Requirements

#### 3.2.1 Front-End Development
• **Core Framework**: Next.js with React
  - Provides server-side rendering and static site generation
  - Component-based architecture for reusable UI components
  - Built-in routing and optimization features

• **Programming Languages**: JavaScript/TypeScript and CSS
  - JavaScript/TypeScript handles dynamic interactions and API calls
  - CSS with Tailwind CSS manages styling and responsive design

• **HTTP Libraries**: Axios or native fetch API
  - Used to make API calls to the Node.js backend server
  - Ensures smooth data retrieval and submission

• **Chart Libraries**: Recharts and Chart.js
  - Used for data visualization on dashboards
  - Display analytics like sales trends and product performance

#### 3.2.2 Back-End Development
• **Runtime Environment**: Node.js
  - JavaScript runtime built on Chrome's V8 JavaScript engine
  - Enables server-side JavaScript execution

• **Framework**: Express.js
  - Fast, unopinionated, minimalist web framework for Node.js
  - Handles routing, middleware, and API endpoints

• **Additional Libraries**:
  - **bcrypt**: Password hashing and authentication
  - **jsonwebtoken**: JWT token generation and verification
  - **cors**: Cross-Origin Resource Sharing middleware
  - **multer**: File upload handling
  - **csv-parser**: CSV file processing for data imports

#### 3.2.3 Database Management
• **Primary Database**: MySQL
  - Relational database for structured data storage
  - Handles user data, products, orders, and analytics

• **Database Libraries**:
  - **mysql2**: MySQL client for Node.js
  - **sequelize**: ORM for database operations and migrations

#### 3.2.4 Development Tools
• **Package Manager**: npm or yarn
• **Development Server**: nodemon for auto-restart during development
• **API Testing**: Postman or Thunder Client
• **Version Control**: Git

---

## CHAPTER 4: SYSTEM DESIGN

### 4.1 Architecture Overview

The system follows a three-tier architecture:

1. **Presentation Layer**: Next.js frontend with React components
2. **Application Layer**: Node.js/Express backend with REST APIs
3. **Data Layer**: MySQL database with structured schemas

### 4.2 API Endpoints

```
GET /api/products - Retrieve all products
POST /api/products - Create new product
GET /api/orders - Retrieve orders
POST /api/auth/login - User authentication
POST /api/auth/register - User registration
GET /api/analytics/sales - Sales analytics data
GET /api/analytics/customers - Customer segmentation data
```

### 4.3 Database Schema

**Users Table**:
- id, name, email, password, role, created_at

**Products Table**:
- id, name, description, price, category, stock, created_at

**Orders Table**:
- id, user_id, total_amount, status, created_at

**Order_Items Table**:
- id, order_id, product_id, quantity, price

---

## CHAPTER 5: IMPLEMENTATION

### 5.1 Backend Implementation (Node.js/Express)

```javascript
// Server setup
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ecommerce'
});

// API routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 5.2 Frontend Implementation (Next.js/React)

```javascript
// Product listing component
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## CHAPTER 6: CONCLUSION

The e-commerce project successfully demonstrates a comprehensive implementation of a modern online shopping platform using **Node.js/Express** for the backend and **Next.js/React** for the frontend. The system effectively combines technology, usability, and performance to deliver a seamless shopping experience.

Key achievements include:
- Scalable Node.js backend with RESTful APIs
- Responsive Next.js frontend with server-side rendering
- Secure MySQL database integration
- Real-time analytics and reporting capabilities
- Modern UI with Tailwind CSS

This project exemplifies the effective use of modern JavaScript technologies to build a secure, efficient, and user-friendly digital marketplace, reflecting real-world e-commerce operations and preparing for future growth in the online retail sector.

---

## REFERENCES

[1] A. Wasilewski, K. Juszczyszyn, and V. Suryani, "Multi-factor evaluation of clustering methods for e-commerce application," Egyptian Informat. J., vol. 28, Dec. 2024.

[2] Raji, M. et al., "E-commerce and consumer behavior: A review of AI-powered personalization and market trends," GSC Advanced Research and Reviews, 2024.

[3] Madanchian, M., "The Impact of Artificial Intelligence Marketing on E-Commerce Sales," Systems, vol. 12, 2024.

[4] Patil, D., "Artificial intelligence in retail and e-commerce: Enhancing customer experience through personalization," SSRN, 2024.

[5] Chau, H. K. L. et al., "Human-AI interaction in E-Commerce: The impact of AI-powered customer service," Computers in Human Behavior Reports, vol. 19, 2025.