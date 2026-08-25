# SOA E-Commerce Platform & Seller Central Admin

An interactive, high-performance E-Commerce web application built with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS 4**. This platform replicates SOA's customer storefront while introducing a dedicated **Merchant Seller Central** dashboard for catalog management, stock monitoring, and order fulfillment.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Dynamic Search & Multi-Facet Filtering**: Real-time filtering by category, price range, customer ratings, Prime delivery eligibility, special deal badges, and sorting options (Price Low-to-High, High-to-Low, Avg Review, Newest).
- **Interactive Shopping Cart & Saved for Later**:
  - Item selection for checkout
  - Save-for-Later list management
  - Free shipping progress calculator ($35 threshold indicator)
  - Real-time subtotal and quantity adjustments
- **Product Detail View**: High-resolution image galleries, ASIN specifications, stock availability indicators, customer reviews, and bullet point feature highlights.
- **Wishlist Management**: One-click add/remove wishlist items with local persistence.
- **End-to-End Checkout Flow**: Multi-step checkout with address management, payment method selection, shipping speed options (Free, Standard, Priority), and instant order confirmation.
- **Live Order Tracking**: Visual progress pipeline for orders (Ordered ➔ Shipped ➔ Out for Delivery ➔ Delivered).

### 🛡️ Merchant Seller Central (Admin Panel)
- **KPI Metrics Dashboard**: Live tracking of total revenue, order count, active inventory count, low stock warnings, and average order value.
- **Full Catalog CRUD Operations**: Add new product listings with custom ASINs, update prices and stock levels, edit metadata, and delete items.
- **Inventory Stock Alerts**: Automated restock priority list identifying low stock (< 10 units) and out-of-stock items with quick restock buttons.
- **Fulfillment Management**: Real-time order status updates for customer deliveries.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion (Framer Motion), Lucide React Icons
- **State Management**: React Context API (`ShopContext`) with `localStorage` state synchronization
- **Backend / Deployment**: Node.js, Express, Vercel (`vercel.json`) configuration

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation & Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RakibShahriar/Ecommerce_amazon.git
   cd Ecommerce_amazon
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source under the Apache-2.0 License.
