# Price Comparer
This project is a website that allows users to compare grocery prices across multiple stores within a selected location. By aggregating up-to-date pricing data from various retailers, the site helps consumers make informed shopping decisions, save money, and plan their purchases more efficiently. Stakeholders will have an opportunity to enter a growing market focused on digital price comparison and consumer analytics and retailers will gain visibility to cost-conscious consumers.

## 📋 Overview

The Price Comparer App provides an intuitive interface for users to search, compare, and manage grocery prices in real-time.  
It targets cost-conscious consumers, while also providing visibility for store vendors.

---

### 🎯 Goals
- Help users find the best prices across stores in the given location.
- Provide shopping lists which can be shared via email or exported.
- Maintain accurate, new and secure data.
- Scale effectively as the user base and product catalog grow.

---

## 👥 Stakeholders

| Stakeholder | Description | Role |
|--------------|--------------|------|
| **End Users / Shoppers** | Individuals seeking cheaper grocery options | Search and compare prices across stores |
| **Store Managers / Vendors** | Grocery stores that list or update product prices | Maintain accurate pricing data and item availability |
| **Developers / Maintainers** | Project team (students) managing the codebase | Maintain APIs, fix bugs, and ensure scalability |
| **Instructor / Evaluator** | Course staff assessing the project | Review deliverables and repository quality |

---

## 🚀 Key Features

- **🔐 User Authentication and Profile** — Sign up, log in, or continue as guest.  
  Logged-in users can save searches, favorite stores, and previous lists.
- **📍 Location Selection** — Set a city or ZIP code to filter results to nearby stores.
- **🧠 Item Search** — Search by item name with autocomplete and suggestions (e.g., “organic eggs”).
- **📊 Multi-Store Comparison Table** — Displays store name, product title, size, price, and last updated time with sorting and filtering.
- **🛍️ Shopping List Management** — Add, view, and delete items from a personal shopping list.
- **📤 Export & Email List** — Export lists as PDF file or email them directly.
- **🧾 Data Freshness** — Each product shows a “last updated” timestamp for transparency.

---

## ⚙️ Functional Requirements

- Users must be able to search and compare grocery prices by location.
- Search results must include store name, product, unit and price.
- Shopping lists must support add, delete and email/export operations.
- Authentication system must allow guest access as fallback.

---

## 🧱 Non-Functional Requirements

- **Security & Compliance** : Protect user credentials, emails, and location data.
- **Performance** : Support multiple concurrent users with smooth response times.
- **Reliability** : Ensure system resilience and quick recovery from failures.
- **Usability** : Simple UI for all users.
- **Monitoring** : Centralized logs and request tracing for quick debugging.
- **Data Freshness** : Show "last updated" timestamps for all price data.

---

## ⚠️ Challenges & Risks

- **Data Accuracy & Freshness** - Prices may become outdated.
- **API / Database Integration** - Latency or sync errors.
- **Scalability** - Slower queries as data grows.
- **Search Relevance** - Misspellings or vague terms.
- **UI Complexity** - Overwhelming results layout.
- **Mobile Responsiveness** - Poor display on small screens.
- **Maintenance** - Ongoing bug fixes and data updates.

---

## 🎨 Design Overview

**Layout & Navigation:**  
A clean layout with a top navigation bar including:
- App name
- Location selector
- Shopping list and logout buttons

**Login Options:**  
- **Sign In** for personalized experience
- **Guest Mode** for quick browsing  

**Search & Filtering:**  
Central search bar with instant results table and filters by:
- Store
- Sort By: (Price low -> high or high -> low)


---

## 🧠 System Architecture

Frontend (HTML, CSS, JS)
↓
Backend API (Node.js + Express)
↓
Database (PostgreSQL)
↓
Scraper Service (Python, Scrapy, BeautifulSoup)
↓
Email & File Export Services

---

## 💻 Tech Stack

- **Frontend** : HTML, CSS, JavaScript.
- **Backend** : Node.js, Express.
- **Database** : PostgreSQL.
- **Scraper** : Python (Scrapy, Requests, BeautifulSoup).
- **Authentication** : Google OAuth.

---

## 🧩 Database Design

**Tables:**
- `users (id, email, password_hash, name)`
- `products (id, name, category, size, brand)`
- `stores (id, name, location)`
- `prices (id, product_id, store_id, price, last_updated)`
- `shopping_list (id, user_id, product_id, quantity)`

Prices are separated from products for efficient updates and scalability.

---

## 🧪 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL
- npm or yarn

---

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/1985lxw/price-comparer
   cd price-comparer
2. **Install dependencies**

    npm install

3. **Set up environment variables**

Create a .env file and define:

- DATABASE_URL=postgresql://user:password@localhost:5432/price_comparer
- EMAIL_API_KEY=your_email_service_key
- GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
- GOOGLE_OAUTH_SECRET=your_google_secret


4. **Run the backend**


npm start

Run the scraper:

python scraper/run_scraper.py

Open in browser:

http://localhost:3000

---

## 🧑‍💻 Contributors

Project Team:

- Xing-Wei/1985lxw					
- Aliya/aliyabedeen
- Nikshitha/nikshitharapolu			          
- Sravani/shiva-sravani-mudiyanur