# Build and Deployment Guide

This document explains how to install, run, test, and deploy the Grocery Price Comparer app.

## 1. Project structure

- `backend/`  Node.js Express API server  
- `frontend/` Static frontend assets that the backend serves  
- `middleware/` Shared middleware and helpers  
- `tests/` Jest plus Supertest backend tests  
- `package.json` Root Node project with scripts and dependencies  

---

## 2. Prerequisites

Install the following on your machine:

- Node.js 18 or later  
- npm (comes with Node)  
- Python 3.9 or later for scraper experiments (optional)  

You also need API keys or service credentials for external services, configured through environment variables.

---

## 3. Installation

Install dependicies 
- npm install

## 4. Set up environment variables

- Create a .env file in the project root:
DATABASE_URL=postgresql://user:password@localhost:5432/price_comparer
EMAIL_API_KEY=your_email_service_key
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_SECRET=your_google_secret
SESSION_SECRET=your_session_secret
PORT=3000


# Running the app

## Start the backend

- npm start
Open in browser:

http://localhost:3000

# Testing
 
- run backend tests by running `NODE_ENV=test npm start` in one terminal, and `npm test` in another